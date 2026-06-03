import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getSession } from '@/lib/auth';

export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const profile = await prisma.profile.findUnique({
      where: { userId: session.id },
    });
    return NextResponse.json({ profile });
  } catch (error: any) {
    return NextResponse.json({ error: 'Failed to fetch profile' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const data = await req.json();

    const updatedProfile = await prisma.profile.upsert({
      where: { userId: session.id },
      update: {
        name: data.name,
        designation: data.designation,
        contactNumber: data.contactNumber,
        companyName: data.companyName,
        gstNumber: data.gstNumber,
        licenseNumber: data.licenseNumber,
        establishedIn: data.establishedIn,
        employees: data.employees,
        linkedinUrl: data.linkedinUrl,
        pincode: data.pincode,
        district: data.district,
        state: data.state,
        country: data.country,
        companyAddress: data.companyAddress,
        companyDescription: data.companyDescription,
        category: data.category || null,
        photos: data.photos || [],
        isCompleted: true,
      },
      create: {
        userId: session.id,
        name: data.name,
        designation: data.designation,
        contactNumber: data.contactNumber,
        companyName: data.companyName,
        gstNumber: data.gstNumber,
        licenseNumber: data.licenseNumber,
        establishedIn: data.establishedIn,
        employees: data.employees,
        linkedinUrl: data.linkedinUrl,
        pincode: data.pincode,
        district: data.district,
        state: data.state,
        country: data.country,
        companyAddress: data.companyAddress,
        companyDescription: data.companyDescription,
        category: data.category || null,
        photos: data.photos || [],
        isCompleted: true,
      },
    });

    return NextResponse.json({ message: 'Profile updated successfully', profile: updatedProfile });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed updating profile' }, { status: 500 });
  }
}