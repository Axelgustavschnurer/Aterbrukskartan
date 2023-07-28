// This endpoint is used to change the password of a user *WHO IS LOGGED IN AND KNOWS THEIR CURRENT PASSWORD*.

import { NextRequest, NextResponse } from 'next/server';
import { getSession, createResponse } from "@/session"
import prisma from "@/prismaClient"
import bcrypt from "bcrypt";

export default async function handler(
  req: NextRequest,
  res: NextResponse
) {
  const response = new Response();
  const session = await getSession(req, response);

  // Make sure the request is a POST request
  if (req.method !== "POST") {
    return createResponse(
      response,
      JSON.stringify({ message: "Method not allowed" }),
      {
        status: 405,
        headers: {
          Allow: "POST",
        }
      }
    );
  }

  // Make sure the user is logged in
  if (!session.user) {
    return createResponse(
      response,
      JSON.stringify({ message: "Unauthorized" }),
      { status: 401 }
    );
  }

  // Get the old and new password from the request body
  let { oldPassword, newPassword }: { oldPassword: string, newPassword: string } = await req.json();

  // Make sure the old and new passwords are present
  if (!oldPassword || !newPassword) {
    return createResponse(
      response,
      JSON.stringify({ message: "Missing old or new password" }),
      { status: 400 }
    );
  }

  // Make sure the old password is correct
  const user = await prisma.user.findUnique({
    where: {
      id: session.user.id,
      email: session.user.email,
    },
    select: {
      password: true,
    }
  });

  if (!user) {
    return createResponse(
      response,
      JSON.stringify({ message: "User not found, try logging out and in again before trying to change password again." }),
      { status: 500 }
    );
  }

  const oldPasswordMatches = await bcrypt.compare(oldPassword, user.password);

  if (!oldPasswordMatches) {
    return createResponse(
      response,
      JSON.stringify({ message: "Old password is incorrect" }),
      { status: 401 }
    );
  }

  // Hash the new password
  const saltRounds = 11;
  const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

  // Update the user's password
  try {
    await prisma.user.update({
      where: {
        id: session.user.id,
        email: session.user.email,
      },
      data: {
        password: hashedPassword,
      }
    });
  }
  catch (error) {
    return createResponse(
      response,
      JSON.stringify({ message: "Error updating password" }),
      { status: 500 }
    );
  }

  return createResponse(
    response,
    JSON.stringify({ message: "Password updated" }),
    { status: 200 }
  );
}