import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/db';
import User from '@/models/User';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'กรุณาเข้าสู่ระบบ' }, { status: 401 });
    }

    await connectDB();
    const userId = (session.user as any).id;
    const user = await User.findById(userId).select('addresses');

    if (!user) {
      return NextResponse.json({ error: 'ไม่พบผู้ใช้' }, { status: 404 });
    }

    // Map backend UserAddress to frontend Address interface
    const addresses = user.addresses.map((addr: any) => ({
      id: addr._id.toString(),
      type: addr.label,
      name: addr.receiverName,
      phone: addr.receiverPhone,
      address: addr.address,
      subDistrict: addr.subDistrict,
      district: addr.district,
      province: addr.province,
      postalCode: addr.postalCode,
      default: addr.isDefault,
    }));

    return NextResponse.json(addresses);
  } catch (error) {
    console.error('Address GET error:', error);
    return NextResponse.json({ error: 'Failed to fetch addresses' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'กรุณาเข้าสู่ระบบ' }, { status: 401 });
    }

    const { type, name, phone, address, subDistrict, district, province, postalCode, default: isDefault } = await req.json();

    await connectDB();
    const userId = (session.user as any).id;
    const user = await User.findById(userId);

    if (!user) {
      return NextResponse.json({ error: 'ไม่พบผู้ใช้' }, { status: 404 });
    }

    // If setting as default, unset other defaults
    if (isDefault) {
      user.addresses.forEach((addr: any) => {
        addr.isDefault = false;
      });
    }

    const newAddress = {
      label: type,
      receiverName: name,
      receiverPhone: phone,
      address,
      subDistrict,
      district,
      province,
      postalCode,
      isDefault: isDefault || user.addresses.length === 0, // Default if first address
    };

    user.addresses.push(newAddress);
    await user.save();

    const savedAddress = user.addresses[user.addresses.length - 1];

    return NextResponse.json({
      id: savedAddress._id.toString(),
      type: savedAddress.label,
      name: savedAddress.receiverName,
      phone: savedAddress.receiverPhone,
      address: savedAddress.address,
      subDistrict: savedAddress.subDistrict,
      district: savedAddress.district,
      province: savedAddress.province,
      postalCode: savedAddress.postalCode,
      default: savedAddress.isDefault,
    });
  } catch (error) {
    console.error('Address POST error:', error);
    return NextResponse.json({ error: 'Failed to add address' }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'กรุณาเข้าสู่ระบบ' }, { status: 401 });
    }

    const { id, type, name, phone, address, subDistrict, district, province, postalCode, default: isDefault } = await req.json();

    await connectDB();
    const userId = (session.user as any).id;
    const user = await User.findById(userId);

    if (!user) {
      return NextResponse.json({ error: 'ไม่พบผู้ใช้' }, { status: 404 });
    }

    const addressToUpdate = user.addresses.id(id);
    if (!addressToUpdate) {
      return NextResponse.json({ error: 'ไม่พบที่อยู่' }, { status: 404 });
    }

    // If setting as default, unset other defaults
    if (isDefault) {
      user.addresses.forEach((addr: any) => {
        addr.isDefault = false;
      });
    }

    addressToUpdate.label = type;
    addressToUpdate.receiverName = name;
    addressToUpdate.receiverPhone = phone;
    addressToUpdate.address = address;
    addressToUpdate.subDistrict = subDistrict;
    addressToUpdate.district = district;
    addressToUpdate.province = province;
    addressToUpdate.postalCode = postalCode;
    addressToUpdate.isDefault = isDefault;

    await user.save();

    return NextResponse.json({
      id: addressToUpdate._id.toString(),
      type: addressToUpdate.label,
      name: addressToUpdate.receiverName,
      phone: addressToUpdate.receiverPhone,
      address: addressToUpdate.address,
      subDistrict: addressToUpdate.subDistrict,
      district: addressToUpdate.district,
      province: addressToUpdate.province,
      postalCode: addressToUpdate.postalCode,
      default: addressToUpdate.isDefault,
    });
  } catch (error) {
    console.error('Address PUT error:', error);
    return NextResponse.json({ error: 'Failed to update address' }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'กรุณาเข้าสู่ระบบ' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Missing address ID' }, { status: 400 });
    }

    await connectDB();
    const userId = (session.user as any).id;
    const user = await User.findById(userId);

    if (!user) {
      return NextResponse.json({ error: 'ไม่พบผู้ใช้' }, { status: 404 });
    }

    const addressToDelete = user.addresses.id(id);
    if (!addressToDelete) {
      return NextResponse.json({ error: 'ไม่พบที่อยู่' }, { status: 404 });
    }

    user.addresses.pull(id);

    // If deleted address was default, set another one as default if any exist
    if (addressToDelete.isDefault && user.addresses.length > 0) {
      user.addresses[0].isDefault = true;
    }

    await user.save();

    return NextResponse.json({ message: 'ลบที่อยู่สำเร็จ' });
  } catch (error) {
    console.error('Address DELETE error:', error);
    return NextResponse.json({ error: 'Failed to delete address' }, { status: 500 });
  }
}
