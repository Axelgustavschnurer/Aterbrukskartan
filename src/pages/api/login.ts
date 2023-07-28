import { NextRequest, NextResponse } from 'next/server';
import { getSession, createResponse } from "@/session"
import prisma from "@/prismaClient"
import bcrypt from "bcrypt";
import { User } from '@prisma/client';

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

  let { email, password }: { email: string, password: string } = await req.json();

  // Validate request body
  if (!email || !password) {
    return createResponse(
      response,
      JSON.stringify({ message: 'Email and password are required' }),
      { status: 400 }
    );
  }

  // Validate credentials
  let user: User;

  try {
    user = await prisma.user.findUniqueOrThrow({
      where: {
        email: email,
      },
      select: {
        id: true,
        email: true,
        password: true,
        isAdmin: true,
        isStoryteller: true,
        isRecycler: true,
      }
    });
  } catch (e) {
    console.log(e);
    return createResponse(
      response,
      JSON.stringify({ message: 'User not found' }),
      { status: 400 }
    );
  }

  // Check password
  const passwordMatches = await bcrypt.compare(password, user.password);

  if (!passwordMatches) {
    return createResponse(
      response,
      JSON.stringify({ message: 'Incorrect password' }),
      { status: 400 }
    );
  }

  // Set session
  session.user = {
    id: user.id,
    email: user.email,
    isLoggedIn: true,
    isAdmin: user.isAdmin,
    isStoryteller: user.isStoryteller,
    isRecycler: user.isRecycler,
  };

  await session.save();

  return createResponse(
    response,
    JSON.stringify({ message: 'Login successful' }),
    { status: 200 }
  );
}