import { NextApiRequest, NextApiResponse } from 'next';
import { getSession, createResponse } from "@/session"
import prisma from "@/prismaClient"
import bcrypt from "bcrypt";
import { Prisma } from '@prisma/client';

type UserInfo = Prisma.UserCreateWithoutRecycleOrganisationsInput;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const response = new Response();
  const session = await getSession(req, res);

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

  // Reject the request if the user is not an admin
  if (!session.user?.isAdmin) {
    return createResponse(
      response,
      JSON.stringify({ message: "Unauthorized; only admins may add new users right now" }),
      { status: 401 }
    );
  }

  // Get the email and password from the request body
  let { email, password, isAdmin, isStoryteller, isRecycler }: UserInfo = await req.json();

  // Make sure the email and password are present
  if (!email || !password) {
    return createResponse(
      response,
      JSON.stringify({ message: "Missing email or password" }),
      { status: 400 }
    );
  }

  // Make sure the email is not yet in use
  const emailExists = await prisma.user.findUnique({
    where: {
      email: email
    }
  })

  if (emailExists) {
    return createResponse(
      response,
      JSON.stringify({ message: "Email " + email + " already exists" }),
      { status: 409 }
    );
  }

  // Hash the password
  const saltRounds = 11;
  const hashedPassword = await bcrypt.hash(password, saltRounds);

  // Create the user
  try {
    await prisma.user.create({
      data: {
        email: email,
        password: hashedPassword,
        isAdmin: isAdmin,
        isStoryteller: isStoryteller,
        isRecycler: isRecycler,
      }
    });
    return createResponse(
      response,
      JSON.stringify({ message: "User created" }),
      { status: 201 }
    );
  }
  catch (error) {
    return createResponse(
      response,
      JSON.stringify({ message: "Error creating user" }),
      { status: 500 }
    );
  }

  // If we get here something went wrong
  return createResponse(
    response,
    JSON.stringify({ message: "Something went very wrong, check database status; stuff may or may not have been created" }),
    { status: 500 }
  );
}