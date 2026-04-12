import {
  PrismaClient,
  Role,
  OrderStatus,
  Priority,
  VehicleType,
  Availability,
  NotificationType,
  NotifChannel,
  FailReason,
} from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient({
  adapter: new PrismaPg({
    connectionString: process.env.DATABASE_URL as string,
  }),
});

const BCRYPT_ROUNDS = 12;
const DEV_PASSWORD = 'Password123!';

// Relative timestamps so data always looks "recent"
function daysAgo(n: number): Date {
  return new Date(Date.now() - n * 24 * 60 * 60 * 1000);
}
function hoursAgo(n: number): Date {
  return new Date(Date.now() - n * 60 * 60 * 1000);
}
function minsAgo(n: number): Date {
  return new Date(Date.now() - n * 60 * 1000);
}
function daysFromNow(n: number): Date {
  return new Date(Date.now() + n * 24 * 60 * 60 * 1000);
}

async function main() {
  console.log('Seeding database...');

  const adminEmail = process.env.ADMIN_EMAIL ?? 'admin@swifthaul.com';
  const existing = await prisma.user.findUnique({
    where: { email: adminEmail },
  });

  if (existing) {
    console.log(
      'Database already seeded. To re-seed, clear the database first.',
    );
    return;
  }

  const devHash = await bcrypt.hash(DEV_PASSWORD, BCRYPT_ROUNDS);
  const adminHash = await bcrypt.hash(
    process.env.ADMIN_TEMP_PASSWORD ?? DEV_PASSWORD,
    BCRYPT_ROUNDS,
  );

  // ── ADMIN ─────────────────────────────────────────────────────────────────

  const admin = await prisma.user.create({
    data: {
      email: adminEmail,
      name: process.env.ADMIN_NAME ?? 'SwiftHaul Admin',
      role: Role.ADMIN,
      passwordHash: adminHash,
      isActive: true,
      mustResetPassword: true,
      inviteAccepted: true,
    },
  });

  // ── DISPATCHERS ───────────────────────────────────────────────────────────

  const dispatcher1 = await prisma.user.create({
    data: {
      email: 'sarah.parker@swifthaul.com',
      name: 'Sarah Parker',
      role: Role.DISPATCHER,
      passwordHash: devHash,
      phone: '+2348011111111',
      isActive: true,
      mustResetPassword: false,
      inviteAccepted: true,
    },
  });

  const dispatcher2 = await prisma.user.create({
    data: {
      email: 'james.okoro@swifthaul.com',
      name: 'James Okoro',
      role: Role.DISPATCHER,
      passwordHash: devHash,
      phone: '+2348022222222',
      isActive: true,
      mustResetPassword: false,
      inviteAccepted: true,
    },
  });

  // ── DRIVERS ───────────────────────────────────────────────────────────────

  const driver1 = await prisma.user.create({
    data: {
      email: 'mike.adeyemi@swifthaul.com',
      name: 'Michael Adeyemi',
      role: Role.DRIVER,
      passwordHash: devHash,
      phone: '+2348033333333',
      isActive: true,
      mustResetPassword: false,
      inviteAccepted: true,
      driverProfile: {
        create: {
          vehicleType: VehicleType.VAN,
          vehiclePlate: 'LAG-234-AB',
          availability: Availability.AVAILABLE,
          currentLat: 6.455,
          currentLng: 3.3841,
          rating: 4.8,
          totalDeliveries: 142,
          completedToday: 3,
          successRate: 97.2,
        },
      },
    },
  });

  const driver2 = await prisma.user.create({
    data: {
      email: 'emma.chen@swifthaul.com',
      name: 'Emma Chen',
      role: Role.DRIVER,
      passwordHash: devHash,
      phone: '+2348044444444',
      isActive: true,
      mustResetPassword: false,
      inviteAccepted: true,
      driverProfile: {
        create: {
          vehicleType: VehicleType.BIKE,
          vehiclePlate: 'LAG-567-CD',
          availability: Availability.BUSY,
          currentLat: 6.4281,
          currentLng: 3.4219,
          rating: 4.9,
          totalDeliveries: 287,
          completedToday: 6,
          successRate: 98.6,
        },
      },
    },
  });

  const driver3 = await prisma.user.create({
    data: {
      email: 'david.osei@swifthaul.com',
      name: 'David Osei',
      role: Role.DRIVER,
      passwordHash: devHash,
      phone: '+2348055555555',
      isActive: true,
      mustResetPassword: false,
      inviteAccepted: true,
      driverProfile: {
        create: {
          vehicleType: VehicleType.CAR,
          vehiclePlate: 'LAG-890-EF',
          availability: Availability.AVAILABLE,
          currentLat: 6.4483,
          currentLng: 3.5206,
          rating: 4.6,
          totalDeliveries: 89,
          completedToday: 2,
          successRate: 94.4,
        },
      },
    },
  });

  const driver4 = await prisma.user.create({
    data: {
      email: 'fatima.hassan@swifthaul.com',
      name: 'Fatima Hassan',
      role: Role.DRIVER,
      passwordHash: devHash,
      phone: '+2348066666666',
      isActive: true,
      mustResetPassword: false,
      inviteAccepted: true,
      driverProfile: {
        create: {
          vehicleType: VehicleType.TRUCK,
          vehiclePlate: 'LAG-123-GH',
          availability: Availability.OFFLINE,
          rating: 4.7,
          totalDeliveries: 51,
          completedToday: 0,
          successRate: 96.1,
        },
      },
    },
  });

  const driver5 = await prisma.user.create({
    data: {
      email: 'chidi.nwachukwu@swifthaul.com',
      name: 'Chidi Nwachukwu',
      role: Role.DRIVER,
      passwordHash: devHash,
      phone: '+2348077777777',
      isActive: true,
      mustResetPassword: false,
      inviteAccepted: true,
      driverProfile: {
        create: {
          vehicleType: VehicleType.CAR,
          vehiclePlate: 'LAG-456-IJ',
          availability: Availability.AVAILABLE,
          currentLat: 6.5244,
          currentLng: 3.3792,
          rating: 4.5,
          totalDeliveries: 210,
          completedToday: 4,
          successRate: 95.7,
        },
      },
    },
  });

  const driver6 = await prisma.user.create({
    data: {
      email: 'aisha.balogun@swifthaul.com',
      name: 'Aisha Balogun',
      role: Role.DRIVER,
      passwordHash: devHash,
      phone: '+2348088888888',
      isActive: true,
      mustResetPassword: false,
      inviteAccepted: true,
      driverProfile: {
        create: {
          vehicleType: VehicleType.VAN,
          vehiclePlate: 'LAG-789-KL',
          availability: Availability.BUSY,
          currentLat: 6.4654,
          currentLng: 3.4064,
          rating: 4.7,
          totalDeliveries: 332,
          completedToday: 7,
          successRate: 98.1,
        },
      },
    },
  });

  const driver7 = await prisma.user.create({
    data: {
      email: 'kunle.ajayi@swifthaul.com',
      name: 'Kunle Ajayi',
      role: Role.DRIVER,
      passwordHash: devHash,
      phone: '+2348099999999',
      isActive: true,
      mustResetPassword: false,
      inviteAccepted: true,
      driverProfile: {
        create: {
          vehicleType: VehicleType.BIKE,
          vehiclePlate: 'LAG-135-MN',
          availability: Availability.AVAILABLE,
          currentLat: 6.4553,
          currentLng: 3.4636,
          rating: 4.9,
          totalDeliveries: 402,
          completedToday: 9,
          successRate: 99.0,
        },
      },
    },
  });

  const driver8 = await prisma.user.create({
    data: {
      email: 'zara.bello@swifthaul.com',
      name: 'Zara Bello',
      role: Role.DRIVER,
      passwordHash: devHash,
      phone: '+2348010101010',
      isActive: true,
      mustResetPassword: false,
      inviteAccepted: true,
      driverProfile: {
        create: {
          vehicleType: VehicleType.CAR,
          vehiclePlate: 'LAG-246-OP',
          availability: Availability.OFFLINE,
          rating: 4.4,
          totalDeliveries: 128,
          completedToday: 0,
          successRate: 93.8,
        },
      },
    },
  });

  const driver9 = await prisma.user.create({
    data: {
      email: 'samuel.okoye@swifthaul.com',
      name: 'Samuel Okoye',
      role: Role.DRIVER,
      passwordHash: devHash,
      phone: '+2348011112222',
      isActive: true,
      mustResetPassword: false,
      inviteAccepted: true,
      driverProfile: {
        create: {
          vehicleType: VehicleType.TRUCK,
          vehiclePlate: 'LAG-357-QR',
          availability: Availability.BUSY,
          currentLat: 6.5618,
          currentLng: 3.3603,
          rating: 4.6,
          totalDeliveries: 76,
          completedToday: 1,
          successRate: 94.9,
        },
      },
    },
  });

  const driver10 = await prisma.user.create({
    data: {
      email: 'lara.ade@swifthaul.com',
      name: 'Lara Ade',
      role: Role.DRIVER,
      passwordHash: devHash,
      phone: '+2348013334444',
      isActive: true,
      mustResetPassword: false,
      inviteAccepted: true,
      driverProfile: {
        create: {
          vehicleType: VehicleType.VAN,
          vehiclePlate: 'LAG-468-ST',
          availability: Availability.AVAILABLE,
          currentLat: 6.4892,
          currentLng: 3.3775,
          rating: 4.8,
          totalDeliveries: 198,
          completedToday: 5,
          successRate: 97.8,
        },
      },
    },
  });

  console.log('Users and driver profiles created.');

  // ── ORDERS ────────────────────────────────────────────────────────────────

  // Order 1 — PENDING, no driver
  await prisma.order.create({
    data: {
      referenceId: 'SH-SEED001',
      status: OrderStatus.PENDING,
      priority: Priority.STANDARD,
      dispatcherId: dispatcher1.id,
      senderName: 'Lagos Gadgets Hub',
      senderPhone: '+2348100000001',
      recipientName: 'Chukwuemeka Nwosu',
      recipientPhone: '+2348100000002',
      recipientEmail: 'emeka.nwosu@email.com',
      pickupAddress: '12 Marina Street, Lagos Island, Lagos',
      pickupLat: 6.4484,
      pickupLng: 3.3948,
      deliveryAddress: '7 Admiralty Way, Lekki Phase 1, Lagos',
      deliveryLat: 6.4295,
      deliveryLng: 3.4748,
      packageDescription: 'Laptop computer (boxed)',
      weightKg: 2.5,
      dimensions: '40 × 30 × 10 cm',
      estimatedDelivery: daysFromNow(1),
      createdAt: hoursAgo(3),
    },
  });

  // Order 2 — PENDING, no driver, EXPRESS
  await prisma.order.create({
    data: {
      referenceId: 'SH-SEED002',
      status: OrderStatus.PENDING,
      priority: Priority.EXPRESS,
      dispatcherId: dispatcher2.id,
      senderName: 'Island Pharmacy',
      senderPhone: '+2348100000003',
      recipientName: 'Amina Yusuf',
      recipientPhone: '+2348100000004',
      pickupAddress: '45 Broad Street, Lagos Island, Lagos',
      pickupLat: 6.4527,
      pickupLng: 3.3915,
      deliveryAddress: '33 Fola Osibo Street, Lekki Phase 1, Lagos',
      deliveryLat: 6.4367,
      deliveryLng: 3.4825,
      packageDescription: 'Medical supplies (fragile)',
      weightKg: 1.2,
      notes: 'Handle with care — contains liquid medication',
      estimatedDelivery: hoursAgo(-6),
      createdAt: hoursAgo(1),
    },
  });

  // Order 3 — ASSIGNED to driver1
  const order3 = await prisma.order.create({
    data: {
      referenceId: 'SH-SEED003',
      status: OrderStatus.ASSIGNED,
      priority: Priority.STANDARD,
      dispatcherId: dispatcher1.id,
      driverId: driver1.id,
      senderName: 'TechZone VI',
      senderPhone: '+2348100000005',
      recipientName: 'Babatunde Adewale',
      recipientPhone: '+2348100000006',
      recipientEmail: 'babs.adewale@company.ng',
      pickupAddress: '8 Adeola Odeku Street, Victoria Island, Lagos',
      pickupLat: 6.4281,
      pickupLng: 3.4219,
      deliveryAddress: '44 Allen Avenue, Ikeja, Lagos',
      deliveryLat: 6.6018,
      deliveryLng: 3.3515,
      packageDescription: 'Two monitors (27 inch)',
      weightKg: 12.0,
      dimensions: '70 × 50 × 20 cm',
      estimatedDelivery: daysFromNow(1),
      createdAt: hoursAgo(5),
    },
  });

  await prisma.orderStatusLog.createMany({
    data: [
      {
        orderId: order3.id,
        fromStatus: OrderStatus.PENDING,
        toStatus: OrderStatus.ASSIGNED,
        changedById: dispatcher1.id,
        createdAt: hoursAgo(4),
      },
    ],
  });

  // Order 4 — ASSIGNED to driver2, EXPRESS
  const order4 = await prisma.order.create({
    data: {
      referenceId: 'SH-SEED004',
      status: OrderStatus.ASSIGNED,
      priority: Priority.EXPRESS,
      dispatcherId: dispatcher2.id,
      driverId: driver2.id,
      senderName: 'Konga Warehouse',
      senderPhone: '+2348100000007',
      recipientName: 'Ngozi Okafor',
      recipientPhone: '+2348100000008',
      pickupAddress: '23 Ozumba Mbadiwe Avenue, Victoria Island, Lagos',
      pickupLat: 6.4229,
      pickupLng: 3.4282,
      deliveryAddress: '102 Awolowo Road, Ikoyi, Lagos',
      deliveryLat: 6.4502,
      deliveryLng: 3.4384,
      packageDescription: 'Fashion clothing bundle (5 items)',
      weightKg: 3.0,
      estimatedDelivery: hoursAgo(-4),
      createdAt: hoursAgo(4),
    },
  });

  await prisma.orderStatusLog.createMany({
    data: [
      {
        orderId: order4.id,
        fromStatus: OrderStatus.PENDING,
        toStatus: OrderStatus.ASSIGNED,
        changedById: dispatcher2.id,
        createdAt: hoursAgo(3),
      },
    ],
  });

  // Order 5 — ACCEPTED by driver1, SAME_DAY
  const order5 = await prisma.order.create({
    data: {
      referenceId: 'SH-SEED005',
      status: OrderStatus.ACCEPTED,
      priority: Priority.SAME_DAY,
      dispatcherId: dispatcher1.id,
      driverId: driver1.id,
      senderName: 'QuickBite Kitchen',
      senderPhone: '+2348100000009',
      recipientName: 'Toluwalope Adeyinka',
      recipientPhone: '+2348100000010',
      pickupAddress: '15 Opebi Road, Ikeja, Lagos',
      pickupLat: 6.5954,
      pickupLng: 3.3375,
      deliveryAddress: '56 Adeniran Ogunsanya Street, Surulere, Lagos',
      deliveryLat: 6.5024,
      deliveryLng: 3.353,
      packageDescription: 'Catered meal boxes (10 units)',
      weightKg: 8.0,
      notes: 'Keep upright — food delivery',
      estimatedDelivery: hoursAgo(-3),
      createdAt: hoursAgo(3),
    },
  });

  await prisma.orderStatusLog.createMany({
    data: [
      {
        orderId: order5.id,
        fromStatus: OrderStatus.PENDING,
        toStatus: OrderStatus.ASSIGNED,
        changedById: dispatcher1.id,
        createdAt: hoursAgo(3),
      },
      {
        orderId: order5.id,
        fromStatus: OrderStatus.ASSIGNED,
        toStatus: OrderStatus.ACCEPTED,
        changedById: driver1.id,
        createdAt: hoursAgo(2),
      },
    ],
  });

  // Order 6 — PICKED_UP by driver2
  const order6 = await prisma.order.create({
    data: {
      referenceId: 'SH-SEED006',
      status: OrderStatus.PICKED_UP,
      priority: Priority.STANDARD,
      dispatcherId: dispatcher2.id,
      driverId: driver2.id,
      senderName: 'Printco Lagos',
      senderPhone: '+2348100000011',
      recipientName: 'Oluwaseun Bello',
      recipientPhone: '+2348100000012',
      recipientEmail: 'seun.bello@design.ng',
      pickupAddress: '3 Idowu Taylor Street, Victoria Island, Lagos',
      pickupLat: 6.4285,
      pickupLng: 3.4145,
      deliveryAddress: '21 Herbert Macaulay Street, Yaba, Lagos',
      deliveryLat: 6.5142,
      deliveryLng: 3.3727,
      packageDescription: 'Printed marketing materials (5 boxes)',
      weightKg: 15.0,
      dimensions: '50 × 40 × 30 cm',
      estimatedDelivery: hoursAgo(-2),
      createdAt: hoursAgo(4),
    },
  });

  await prisma.orderStatusLog.createMany({
    data: [
      {
        orderId: order6.id,
        fromStatus: OrderStatus.PENDING,
        toStatus: OrderStatus.ASSIGNED,
        changedById: dispatcher2.id,
        createdAt: hoursAgo(4),
      },
      {
        orderId: order6.id,
        fromStatus: OrderStatus.ASSIGNED,
        toStatus: OrderStatus.ACCEPTED,
        changedById: driver2.id,
        createdAt: hoursAgo(3),
      },
      {
        orderId: order6.id,
        fromStatus: OrderStatus.ACCEPTED,
        toStatus: OrderStatus.PICKED_UP,
        changedById: driver2.id,
        createdAt: hoursAgo(1),
      },
    ],
  });

  // Order 7 — IN_TRANSIT, driver1, EXPRESS
  const order7 = await prisma.order.create({
    data: {
      referenceId: 'SH-SEED007',
      status: OrderStatus.IN_TRANSIT,
      priority: Priority.EXPRESS,
      dispatcherId: dispatcher1.id,
      driverId: driver1.id,
      senderName: 'Zenith Electronics',
      senderPhone: '+2348100000013',
      recipientName: 'Chidi Obiora',
      recipientPhone: '+2348100000014',
      pickupAddress: '12 Marina Street, Lagos Island, Lagos',
      pickupLat: 6.4484,
      pickupLng: 3.3948,
      deliveryAddress: '7 Admiralty Way, Lekki Phase 1, Lagos',
      deliveryLat: 6.4295,
      deliveryLng: 3.4748,
      packageDescription: 'Smart TV (55 inch)',
      weightKg: 22.0,
      dimensions: '140 × 85 × 15 cm',
      estimatedDelivery: hoursAgo(-1),
      createdAt: hoursAgo(5),
    },
  });

  await prisma.orderStatusLog.createMany({
    data: [
      {
        orderId: order7.id,
        fromStatus: OrderStatus.PENDING,
        toStatus: OrderStatus.ASSIGNED,
        changedById: dispatcher1.id,
        createdAt: hoursAgo(5),
      },
      {
        orderId: order7.id,
        fromStatus: OrderStatus.ASSIGNED,
        toStatus: OrderStatus.ACCEPTED,
        changedById: driver1.id,
        createdAt: hoursAgo(4),
      },
      {
        orderId: order7.id,
        fromStatus: OrderStatus.ACCEPTED,
        toStatus: OrderStatus.PICKED_UP,
        changedById: driver1.id,
        createdAt: hoursAgo(3),
      },
      {
        orderId: order7.id,
        fromStatus: OrderStatus.PICKED_UP,
        toStatus: OrderStatus.IN_TRANSIT,
        changedById: driver1.id,
        createdAt: hoursAgo(2),
      },
    ],
  });

  // Location pings for order7
  await prisma.locationPing.createMany({
    data: [
      {
        orderId: order7.id,
        driverId: driver1.id,
        lat: 6.4484,
        lng: 3.3948,
        speed: 0,
        createdAt: hoursAgo(2),
      },
      {
        orderId: order7.id,
        driverId: driver1.id,
        lat: 6.443,
        lng: 3.405,
        speed: 35,
        heading: 90,
        createdAt: minsAgo(90),
      },
      {
        orderId: order7.id,
        driverId: driver1.id,
        lat: 6.438,
        lng: 3.42,
        speed: 28,
        heading: 95,
        createdAt: minsAgo(60),
      },
      {
        orderId: order7.id,
        driverId: driver1.id,
        lat: 6.433,
        lng: 3.44,
        speed: 40,
        heading: 88,
        createdAt: minsAgo(30),
      },
      {
        orderId: order7.id,
        driverId: driver1.id,
        lat: 6.431,
        lng: 3.462,
        speed: 20,
        heading: 92,
        createdAt: minsAgo(10),
      },
    ],
  });

  // Order 8 — IN_TRANSIT, driver3, STANDARD
  const order8 = await prisma.order.create({
    data: {
      referenceId: 'SH-SEED008',
      status: OrderStatus.IN_TRANSIT,
      priority: Priority.STANDARD,
      dispatcherId: dispatcher2.id,
      driverId: driver3.id,
      senderName: 'Lagos Book Store',
      senderPhone: '+2348100000015',
      recipientName: 'Funmilayo Adunola',
      recipientPhone: '+2348100000016',
      pickupAddress: '45 Broad Street, Lagos Island, Lagos',
      pickupLat: 6.4527,
      pickupLng: 3.3915,
      deliveryAddress: '56 Adeniran Ogunsanya Street, Surulere, Lagos',
      deliveryLat: 6.5024,
      deliveryLng: 3.353,
      packageDescription: 'Textbooks (box of 12)',
      weightKg: 18.0,
      estimatedDelivery: daysFromNow(1),
      createdAt: hoursAgo(6),
    },
  });

  await prisma.orderStatusLog.createMany({
    data: [
      {
        orderId: order8.id,
        fromStatus: OrderStatus.PENDING,
        toStatus: OrderStatus.ASSIGNED,
        changedById: dispatcher2.id,
        createdAt: hoursAgo(6),
      },
      {
        orderId: order8.id,
        fromStatus: OrderStatus.ASSIGNED,
        toStatus: OrderStatus.ACCEPTED,
        changedById: driver3.id,
        createdAt: hoursAgo(5),
      },
      {
        orderId: order8.id,
        fromStatus: OrderStatus.ACCEPTED,
        toStatus: OrderStatus.PICKED_UP,
        changedById: driver3.id,
        createdAt: hoursAgo(4),
      },
      {
        orderId: order8.id,
        fromStatus: OrderStatus.PICKED_UP,
        toStatus: OrderStatus.IN_TRANSIT,
        changedById: driver3.id,
        createdAt: hoursAgo(3),
      },
    ],
  });

  await prisma.locationPing.createMany({
    data: [
      {
        orderId: order8.id,
        driverId: driver3.id,
        lat: 6.4527,
        lng: 3.3915,
        speed: 0,
        createdAt: hoursAgo(3),
      },
      {
        orderId: order8.id,
        driverId: driver3.id,
        lat: 6.467,
        lng: 3.385,
        speed: 30,
        heading: 20,
        createdAt: minsAgo(120),
      },
      {
        orderId: order8.id,
        driverId: driver3.id,
        lat: 6.488,
        lng: 3.368,
        speed: 45,
        heading: 15,
        createdAt: minsAgo(60),
      },
      {
        orderId: order8.id,
        driverId: driver3.id,
        lat: 6.499,
        lng: 3.357,
        speed: 25,
        heading: 10,
        createdAt: minsAgo(20),
      },
    ],
  });

  // Order 9 — OUT_FOR_DELIVERY, driver2, SAME_DAY
  const order9 = await prisma.order.create({
    data: {
      referenceId: 'SH-SEED009',
      status: OrderStatus.OUT_FOR_DELIVERY,
      priority: Priority.SAME_DAY,
      dispatcherId: dispatcher1.id,
      driverId: driver2.id,
      senderName: 'Jumia Express Hub',
      senderPhone: '+2348100000017',
      recipientName: 'Adaeze Nnaji',
      recipientPhone: '+2348100000018',
      recipientEmail: 'adaeze.nnaji@gmail.com',
      pickupAddress: '8 Adeola Odeku Street, Victoria Island, Lagos',
      pickupLat: 6.4281,
      pickupLng: 3.4219,
      deliveryAddress: '33 Fola Osibo Street, Lekki Phase 1, Lagos',
      deliveryLat: 6.4367,
      deliveryLng: 3.4825,
      packageDescription: 'Smartphone — iPhone 15 Pro',
      weightKg: 0.5,
      dimensions: '16 × 8 × 1 cm',
      notes: 'Call recipient 10 minutes before arrival',
      estimatedDelivery: hoursAgo(-1),
      createdAt: hoursAgo(8),
    },
  });

  await prisma.orderStatusLog.createMany({
    data: [
      {
        orderId: order9.id,
        fromStatus: OrderStatus.PENDING,
        toStatus: OrderStatus.ASSIGNED,
        changedById: dispatcher1.id,
        createdAt: hoursAgo(8),
      },
      {
        orderId: order9.id,
        fromStatus: OrderStatus.ASSIGNED,
        toStatus: OrderStatus.ACCEPTED,
        changedById: driver2.id,
        createdAt: hoursAgo(7),
      },
      {
        orderId: order9.id,
        fromStatus: OrderStatus.ACCEPTED,
        toStatus: OrderStatus.PICKED_UP,
        changedById: driver2.id,
        createdAt: hoursAgo(5),
      },
      {
        orderId: order9.id,
        fromStatus: OrderStatus.PICKED_UP,
        toStatus: OrderStatus.IN_TRANSIT,
        changedById: driver2.id,
        createdAt: hoursAgo(3),
      },
      {
        orderId: order9.id,
        fromStatus: OrderStatus.IN_TRANSIT,
        toStatus: OrderStatus.OUT_FOR_DELIVERY,
        changedById: driver2.id,
        createdAt: minsAgo(30),
      },
    ],
  });

  await prisma.locationPing.createMany({
    data: [
      {
        orderId: order9.id,
        driverId: driver2.id,
        lat: 6.432,
        lng: 3.459,
        speed: 15,
        heading: 80,
        createdAt: minsAgo(25),
      },
      {
        orderId: order9.id,
        driverId: driver2.id,
        lat: 6.435,
        lng: 3.472,
        speed: 12,
        heading: 85,
        createdAt: minsAgo(15),
      },
      {
        orderId: order9.id,
        driverId: driver2.id,
        lat: 6.437,
        lng: 3.481,
        speed: 5,
        heading: 88,
        createdAt: minsAgo(5),
      },
    ],
  });

  // Order 10 — DELIVERED, driver1
  const order10 = await prisma.order.create({
    data: {
      referenceId: 'SH-SEED010',
      status: OrderStatus.DELIVERED,
      priority: Priority.STANDARD,
      dispatcherId: dispatcher2.id,
      driverId: driver1.id,
      senderName: 'HomeStyle Furniture',
      senderPhone: '+2348100000019',
      recipientName: 'Emeka Chibuike',
      recipientPhone: '+2348100000020',
      pickupAddress: '12 Marina Street, Lagos Island, Lagos',
      pickupLat: 6.4484,
      pickupLng: 3.3948,
      deliveryAddress: '102 Awolowo Road, Ikoyi, Lagos',
      deliveryLat: 6.4502,
      deliveryLng: 3.4384,
      packageDescription: 'Office chair (assembled)',
      weightKg: 14.0,
      dimensions: '65 × 65 × 120 cm',
      estimatedDelivery: daysAgo(1),
      createdAt: daysAgo(2),
    },
  });

  await prisma.orderStatusLog.createMany({
    data: [
      {
        orderId: order10.id,
        fromStatus: OrderStatus.PENDING,
        toStatus: OrderStatus.ASSIGNED,
        changedById: dispatcher2.id,
        createdAt: daysAgo(2),
      },
      {
        orderId: order10.id,
        fromStatus: OrderStatus.ASSIGNED,
        toStatus: OrderStatus.ACCEPTED,
        changedById: driver1.id,
        createdAt: daysAgo(2),
      },
      {
        orderId: order10.id,
        fromStatus: OrderStatus.ACCEPTED,
        toStatus: OrderStatus.PICKED_UP,
        changedById: driver1.id,
        createdAt: daysAgo(1),
      },
      {
        orderId: order10.id,
        fromStatus: OrderStatus.PICKED_UP,
        toStatus: OrderStatus.IN_TRANSIT,
        changedById: driver1.id,
        createdAt: daysAgo(1),
      },
      {
        orderId: order10.id,
        fromStatus: OrderStatus.IN_TRANSIT,
        toStatus: OrderStatus.OUT_FOR_DELIVERY,
        changedById: driver1.id,
        createdAt: daysAgo(1),
      },
      {
        orderId: order10.id,
        fromStatus: OrderStatus.OUT_FOR_DELIVERY,
        toStatus: OrderStatus.DELIVERED,
        changedById: driver1.id,
        createdAt: daysAgo(1),
      },
    ],
  });

  await prisma.proofOfDelivery.create({
    data: {
      orderId: order10.id,
      signedBy: 'Emeka Chibuike',
      notes: 'Left with receptionist at gate.',
      uploadedAt: daysAgo(1),
    },
  });

  // Order 11 — DELIVERED, driver2, EXPRESS
  const order11 = await prisma.order.create({
    data: {
      referenceId: 'SH-SEED011',
      status: OrderStatus.DELIVERED,
      priority: Priority.EXPRESS,
      dispatcherId: dispatcher1.id,
      driverId: driver2.id,
      senderName: 'Lagos Gadgets Hub',
      senderPhone: '+2348100000021',
      recipientName: 'Taiwo Olawale',
      recipientPhone: '+2348100000022',
      recipientEmail: 'taiwo.olawale@work.ng',
      pickupAddress: '23 Ozumba Mbadiwe Avenue, Victoria Island, Lagos',
      pickupLat: 6.4229,
      pickupLng: 3.4282,
      deliveryAddress: '44 Allen Avenue, Ikeja, Lagos',
      deliveryLat: 6.6018,
      deliveryLng: 3.3515,
      packageDescription: 'Wireless earbuds + charging case',
      weightKg: 0.3,
      dimensions: '10 × 8 × 5 cm',
      estimatedDelivery: daysAgo(1),
      createdAt: daysAgo(3),
    },
  });

  await prisma.orderStatusLog.createMany({
    data: [
      {
        orderId: order11.id,
        fromStatus: OrderStatus.PENDING,
        toStatus: OrderStatus.ASSIGNED,
        changedById: dispatcher1.id,
        createdAt: daysAgo(3),
      },
      {
        orderId: order11.id,
        fromStatus: OrderStatus.ASSIGNED,
        toStatus: OrderStatus.ACCEPTED,
        changedById: driver2.id,
        createdAt: daysAgo(3),
      },
      {
        orderId: order11.id,
        fromStatus: OrderStatus.ACCEPTED,
        toStatus: OrderStatus.PICKED_UP,
        changedById: driver2.id,
        createdAt: daysAgo(2),
      },
      {
        orderId: order11.id,
        fromStatus: OrderStatus.PICKED_UP,
        toStatus: OrderStatus.IN_TRANSIT,
        changedById: driver2.id,
        createdAt: daysAgo(2),
      },
      {
        orderId: order11.id,
        fromStatus: OrderStatus.IN_TRANSIT,
        toStatus: OrderStatus.OUT_FOR_DELIVERY,
        changedById: driver2.id,
        createdAt: daysAgo(1),
      },
      {
        orderId: order11.id,
        fromStatus: OrderStatus.OUT_FOR_DELIVERY,
        toStatus: OrderStatus.DELIVERED,
        changedById: driver2.id,
        createdAt: daysAgo(1),
      },
    ],
  });

  await prisma.proofOfDelivery.create({
    data: {
      orderId: order11.id,
      signedBy: 'Taiwo Olawale',
      notes: 'Delivered directly to recipient. Item verified intact.',
      uploadedAt: daysAgo(1),
    },
  });

  // Order 12 — DELIVERED, driver3
  const order12 = await prisma.order.create({
    data: {
      referenceId: 'SH-SEED012',
      status: OrderStatus.DELIVERED,
      priority: Priority.STANDARD,
      dispatcherId: dispatcher2.id,
      driverId: driver3.id,
      senderName: 'Island Pharmacy',
      senderPhone: '+2348100000023',
      recipientName: 'Grace Okonkwo',
      recipientPhone: '+2348100000024',
      pickupAddress: '45 Broad Street, Lagos Island, Lagos',
      pickupLat: 6.4527,
      pickupLng: 3.3915,
      deliveryAddress: '21 Herbert Macaulay Street, Yaba, Lagos',
      deliveryLat: 6.5142,
      deliveryLng: 3.3727,
      packageDescription: 'Prescription medication (sealed)',
      weightKg: 0.8,
      notes: 'Refrigerate upon delivery',
      estimatedDelivery: daysAgo(2),
      createdAt: daysAgo(4),
    },
  });

  await prisma.orderStatusLog.createMany({
    data: [
      {
        orderId: order12.id,
        fromStatus: OrderStatus.PENDING,
        toStatus: OrderStatus.ASSIGNED,
        changedById: dispatcher2.id,
        createdAt: daysAgo(4),
      },
      {
        orderId: order12.id,
        fromStatus: OrderStatus.ASSIGNED,
        toStatus: OrderStatus.ACCEPTED,
        changedById: driver3.id,
        createdAt: daysAgo(4),
      },
      {
        orderId: order12.id,
        fromStatus: OrderStatus.ACCEPTED,
        toStatus: OrderStatus.PICKED_UP,
        changedById: driver3.id,
        createdAt: daysAgo(3),
      },
      {
        orderId: order12.id,
        fromStatus: OrderStatus.PICKED_UP,
        toStatus: OrderStatus.IN_TRANSIT,
        changedById: driver3.id,
        createdAt: daysAgo(3),
      },
      {
        orderId: order12.id,
        fromStatus: OrderStatus.IN_TRANSIT,
        toStatus: OrderStatus.OUT_FOR_DELIVERY,
        changedById: driver3.id,
        createdAt: daysAgo(2),
      },
      {
        orderId: order12.id,
        fromStatus: OrderStatus.OUT_FOR_DELIVERY,
        toStatus: OrderStatus.DELIVERED,
        changedById: driver3.id,
        createdAt: daysAgo(2),
      },
    ],
  });

  await prisma.proofOfDelivery.create({
    data: {
      orderId: order12.id,
      signedBy: 'Grace Okonkwo',
      notes: 'Informed recipient to refrigerate immediately.',
      uploadedAt: daysAgo(2),
    },
  });

  // Order 13 — FAILED, driver3, EXPRESS
  const order13 = await prisma.order.create({
    data: {
      referenceId: 'SH-SEED013',
      status: OrderStatus.FAILED,
      priority: Priority.EXPRESS,
      dispatcherId: dispatcher1.id,
      driverId: driver3.id,
      senderName: 'TechZone VI',
      senderPhone: '+2348100000025',
      recipientName: 'Kelechi Eze',
      recipientPhone: '+2348100000026',
      pickupAddress: '8 Adeola Odeku Street, Victoria Island, Lagos',
      pickupLat: 6.4281,
      pickupLng: 3.4219,
      deliveryAddress: '56 Adeniran Ogunsanya Street, Surulere, Lagos',
      deliveryLat: 6.5024,
      deliveryLng: 3.353,
      packageDescription: 'Gaming console bundle',
      weightKg: 5.0,
      dimensions: '45 × 35 × 25 cm',
      failedAttempts: 1,
      estimatedDelivery: daysAgo(1),
      createdAt: daysAgo(2),
    },
  });

  await prisma.orderStatusLog.createMany({
    data: [
      {
        orderId: order13.id,
        fromStatus: OrderStatus.PENDING,
        toStatus: OrderStatus.ASSIGNED,
        changedById: dispatcher1.id,
        createdAt: daysAgo(2),
      },
      {
        orderId: order13.id,
        fromStatus: OrderStatus.ASSIGNED,
        toStatus: OrderStatus.ACCEPTED,
        changedById: driver3.id,
        createdAt: daysAgo(2),
      },
      {
        orderId: order13.id,
        fromStatus: OrderStatus.ACCEPTED,
        toStatus: OrderStatus.PICKED_UP,
        changedById: driver3.id,
        createdAt: daysAgo(1),
      },
      {
        orderId: order13.id,
        fromStatus: OrderStatus.PICKED_UP,
        toStatus: OrderStatus.IN_TRANSIT,
        changedById: driver3.id,
        createdAt: daysAgo(1),
      },
      {
        orderId: order13.id,
        fromStatus: OrderStatus.IN_TRANSIT,
        toStatus: OrderStatus.OUT_FOR_DELIVERY,
        changedById: driver3.id,
        createdAt: daysAgo(1),
      },
      {
        orderId: order13.id,
        fromStatus: OrderStatus.OUT_FOR_DELIVERY,
        toStatus: OrderStatus.FAILED,
        changedById: driver3.id,
        note: 'Recipient not home after 3 attempts',
        createdAt: daysAgo(1),
      },
    ],
  });

  await prisma.proofOfDelivery.create({
    data: {
      orderId: order13.id,
      failReason: FailReason.NOT_HOME,
      failureNotes:
        'Knocked and called recipient three times. No answer. Neighbour confirmed recipient is travelling.',
      uploadedAt: daysAgo(1),
    },
  });

  // Order 14 — RESCHEDULED, driver4
  const order14 = await prisma.order.create({
    data: {
      referenceId: 'SH-SEED014',
      status: OrderStatus.RESCHEDULED,
      priority: Priority.STANDARD,
      dispatcherId: dispatcher2.id,
      driverId: driver4.id,
      senderName: 'Lagos Book Store',
      senderPhone: '+2348100000027',
      recipientName: 'Ibrahim Musa',
      recipientPhone: '+2348100000028',
      pickupAddress: '12 Marina Street, Lagos Island, Lagos',
      pickupLat: 6.4484,
      pickupLng: 3.3948,
      deliveryAddress: '44 Allen Avenue, Ikeja, Lagos',
      deliveryLat: 6.6018,
      deliveryLng: 3.3515,
      packageDescription: 'University textbook set (4 books)',
      weightKg: 6.0,
      failedAttempts: 1,
      estimatedDelivery: daysFromNow(1),
      createdAt: daysAgo(3),
    },
  });

  await prisma.orderStatusLog.createMany({
    data: [
      {
        orderId: order14.id,
        fromStatus: OrderStatus.PENDING,
        toStatus: OrderStatus.ASSIGNED,
        changedById: dispatcher2.id,
        createdAt: daysAgo(3),
      },
      {
        orderId: order14.id,
        fromStatus: OrderStatus.ASSIGNED,
        toStatus: OrderStatus.ACCEPTED,
        changedById: driver4.id,
        createdAt: daysAgo(3),
      },
      {
        orderId: order14.id,
        fromStatus: OrderStatus.ACCEPTED,
        toStatus: OrderStatus.PICKED_UP,
        changedById: driver4.id,
        createdAt: daysAgo(2),
      },
      {
        orderId: order14.id,
        fromStatus: OrderStatus.PICKED_UP,
        toStatus: OrderStatus.IN_TRANSIT,
        changedById: driver4.id,
        createdAt: daysAgo(2),
      },
      {
        orderId: order14.id,
        fromStatus: OrderStatus.IN_TRANSIT,
        toStatus: OrderStatus.OUT_FOR_DELIVERY,
        changedById: driver4.id,
        createdAt: daysAgo(2),
      },
      {
        orderId: order14.id,
        fromStatus: OrderStatus.OUT_FOR_DELIVERY,
        toStatus: OrderStatus.FAILED,
        changedById: driver4.id,
        note: 'Wrong address on order',
        createdAt: daysAgo(2),
      },
      {
        orderId: order14.id,
        fromStatus: OrderStatus.FAILED,
        toStatus: OrderStatus.RESCHEDULED,
        changedById: dispatcher2.id,
        note: 'Confirmed correct address with sender. Scheduled for tomorrow.',
        createdAt: daysAgo(1),
      },
    ],
  });

  // Order 15 — CANCELLED
  const order15 = await prisma.order.create({
    data: {
      referenceId: 'SH-SEED015',
      status: OrderStatus.CANCELLED,
      priority: Priority.STANDARD,
      dispatcherId: dispatcher1.id,
      senderName: 'Konga Warehouse',
      senderPhone: '+2348100000029',
      recipientName: 'Olumide Fashola',
      recipientPhone: '+2348100000030',
      pickupAddress: '23 Ozumba Mbadiwe Avenue, Victoria Island, Lagos',
      pickupLat: 6.4229,
      pickupLng: 3.4282,
      deliveryAddress: '21 Herbert Macaulay Street, Yaba, Lagos',
      deliveryLat: 6.5142,
      deliveryLng: 3.3727,
      packageDescription: 'Home appliance (blender)',
      weightKg: 3.5,
      estimatedDelivery: daysAgo(1),
      createdAt: daysAgo(2),
    },
  });

  await prisma.orderStatusLog.createMany({
    data: [
      {
        orderId: order15.id,
        fromStatus: OrderStatus.PENDING,
        toStatus: OrderStatus.CANCELLED,
        changedById: dispatcher1.id,
        note: 'Customer requested cancellation before pickup',
        createdAt: daysAgo(2),
      },
    ],
  });

  // Order 16 — PENDING
  await prisma.order.create({
    data: {
      referenceId: 'SH-SEED016',
      status: OrderStatus.PENDING,
      priority: Priority.STANDARD,
      dispatcherId: dispatcher2.id,
      senderName: 'Swift Supplies',
      senderPhone: '+2348100000031',
      recipientName: 'Ruth Bello',
      recipientPhone: '+2348100000032',
      pickupAddress: '11 Akin Adesola Street, Victoria Island, Lagos',
      pickupLat: 6.428,
      pickupLng: 3.414,
      deliveryAddress: '19 Allen Avenue, Ikeja, Lagos',
      deliveryLat: 6.6018,
      deliveryLng: 3.3515,
      packageDescription: 'Office stationery (2 cartons)',
      weightKg: 4.5,
      estimatedDelivery: daysFromNow(1),
      createdAt: hoursAgo(2),
    },
  });

  // Order 17 — ASSIGNED to driver5
  const order17 = await prisma.order.create({
    data: {
      referenceId: 'SH-SEED017',
      status: OrderStatus.ASSIGNED,
      priority: Priority.EXPRESS,
      dispatcherId: dispatcher1.id,
      driverId: driver5.id,
      senderName: 'CityMart Lekki',
      senderPhone: '+2348100000033',
      recipientName: 'Ifeanyi Udo',
      recipientPhone: '+2348100000034',
      pickupAddress: '14 Admiralty Way, Lekki Phase 1, Lagos',
      pickupLat: 6.4295,
      pickupLng: 3.4748,
      deliveryAddress: '5 Bode Thomas Street, Surulere, Lagos',
      deliveryLat: 6.5064,
      deliveryLng: 3.3547,
      packageDescription: 'Personal care items',
      weightKg: 2.0,
      estimatedDelivery: hoursAgo(-5),
      createdAt: hoursAgo(5),
    },
  });

  await prisma.orderStatusLog.createMany({
    data: [
      {
        orderId: order17.id,
        fromStatus: OrderStatus.PENDING,
        toStatus: OrderStatus.ASSIGNED,
        changedById: dispatcher1.id,
        createdAt: hoursAgo(4),
      },
    ],
  });

  // Order 18 — ACCEPTED by driver6
  const order18 = await prisma.order.create({
    data: {
      referenceId: 'SH-SEED018',
      status: OrderStatus.ACCEPTED,
      priority: Priority.SAME_DAY,
      dispatcherId: dispatcher2.id,
      driverId: driver6.id,
      senderName: 'FreshBite Kitchens',
      senderPhone: '+2348100000035',
      recipientName: 'Tomi Adegoke',
      recipientPhone: '+2348100000036',
      pickupAddress: '7 Opebi Road, Ikeja, Lagos',
      pickupLat: 6.5954,
      pickupLng: 3.3375,
      deliveryAddress: '28 Oniru Road, Victoria Island, Lagos',
      deliveryLat: 6.4312,
      deliveryLng: 3.4667,
      packageDescription: 'Meal prep boxes (8 units)',
      weightKg: 6.5,
      notes: 'Keep upright — hot meals',
      estimatedDelivery: hoursAgo(-2),
      createdAt: hoursAgo(3),
    },
  });

  await prisma.orderStatusLog.createMany({
    data: [
      {
        orderId: order18.id,
        fromStatus: OrderStatus.PENDING,
        toStatus: OrderStatus.ASSIGNED,
        changedById: dispatcher2.id,
        createdAt: hoursAgo(3),
      },
      {
        orderId: order18.id,
        fromStatus: OrderStatus.ASSIGNED,
        toStatus: OrderStatus.ACCEPTED,
        changedById: driver6.id,
        createdAt: hoursAgo(2),
      },
    ],
  });

  // Order 19 — PICKED_UP by driver7
  const order19 = await prisma.order.create({
    data: {
      referenceId: 'SH-SEED019',
      status: OrderStatus.PICKED_UP,
      priority: Priority.STANDARD,
      dispatcherId: dispatcher1.id,
      driverId: driver7.id,
      senderName: 'PrintLab Yaba',
      senderPhone: '+2348100000037',
      recipientName: 'Nneka Obi',
      recipientPhone: '+2348100000038',
      pickupAddress: '9 Herbert Macaulay Street, Yaba, Lagos',
      pickupLat: 6.5142,
      pickupLng: 3.3727,
      deliveryAddress: '102 Awolowo Road, Ikoyi, Lagos',
      deliveryLat: 6.4502,
      deliveryLng: 3.4384,
      packageDescription: 'Event flyers (3 boxes)',
      weightKg: 9.0,
      estimatedDelivery: hoursAgo(-1),
      createdAt: hoursAgo(4),
    },
  });

  await prisma.orderStatusLog.createMany({
    data: [
      {
        orderId: order19.id,
        fromStatus: OrderStatus.PENDING,
        toStatus: OrderStatus.ASSIGNED,
        changedById: dispatcher1.id,
        createdAt: hoursAgo(4),
      },
      {
        orderId: order19.id,
        fromStatus: OrderStatus.ASSIGNED,
        toStatus: OrderStatus.ACCEPTED,
        changedById: driver7.id,
        createdAt: hoursAgo(3),
      },
      {
        orderId: order19.id,
        fromStatus: OrderStatus.ACCEPTED,
        toStatus: OrderStatus.PICKED_UP,
        changedById: driver7.id,
        createdAt: hoursAgo(2),
      },
    ],
  });

  // Order 20 — IN_TRANSIT, driver5
  const order20 = await prisma.order.create({
    data: {
      referenceId: 'SH-SEED020',
      status: OrderStatus.IN_TRANSIT,
      priority: Priority.EXPRESS,
      dispatcherId: dispatcher2.id,
      driverId: driver5.id,
      senderName: 'GadgetPro Ikeja',
      senderPhone: '+2348100000039',
      recipientName: 'Femi Ogunleye',
      recipientPhone: '+2348100000040',
      pickupAddress: '16 Allen Avenue, Ikeja, Lagos',
      pickupLat: 6.6018,
      pickupLng: 3.3515,
      deliveryAddress: '15 Opebi Road, Ikeja, Lagos',
      deliveryLat: 6.5954,
      deliveryLng: 3.3375,
      packageDescription: 'Laptop + accessories',
      weightKg: 3.2,
      estimatedDelivery: hoursAgo(-1),
      createdAt: hoursAgo(5),
    },
  });

  await prisma.orderStatusLog.createMany({
    data: [
      {
        orderId: order20.id,
        fromStatus: OrderStatus.PENDING,
        toStatus: OrderStatus.ASSIGNED,
        changedById: dispatcher2.id,
        createdAt: hoursAgo(5),
      },
      {
        orderId: order20.id,
        fromStatus: OrderStatus.ASSIGNED,
        toStatus: OrderStatus.ACCEPTED,
        changedById: driver5.id,
        createdAt: hoursAgo(4),
      },
      {
        orderId: order20.id,
        fromStatus: OrderStatus.ACCEPTED,
        toStatus: OrderStatus.PICKED_UP,
        changedById: driver5.id,
        createdAt: hoursAgo(3),
      },
      {
        orderId: order20.id,
        fromStatus: OrderStatus.PICKED_UP,
        toStatus: OrderStatus.IN_TRANSIT,
        changedById: driver5.id,
        createdAt: hoursAgo(2),
      },
    ],
  });

  await prisma.locationPing.createMany({
    data: [
      {
        orderId: order20.id,
        driverId: driver5.id,
        lat: 6.6018,
        lng: 3.3515,
        speed: 0,
        createdAt: hoursAgo(2),
      },
      {
        orderId: order20.id,
        driverId: driver5.id,
        lat: 6.598,
        lng: 3.346,
        speed: 22,
        heading: 210,
        createdAt: minsAgo(70),
      },
      {
        orderId: order20.id,
        driverId: driver5.id,
        lat: 6.596,
        lng: 3.341,
        speed: 18,
        heading: 205,
        createdAt: minsAgo(35),
      },
    ],
  });

  // Order 21 — OUT_FOR_DELIVERY, driver6
  const order21 = await prisma.order.create({
    data: {
      referenceId: 'SH-SEED021',
      status: OrderStatus.OUT_FOR_DELIVERY,
      priority: Priority.SAME_DAY,
      dispatcherId: dispatcher1.id,
      driverId: driver6.id,
      senderName: 'MediCare Pharmacy',
      senderPhone: '+2348100000041',
      recipientName: 'Lilian Umeh',
      recipientPhone: '+2348100000042',
      pickupAddress: '5 Bode Thomas Street, Surulere, Lagos',
      pickupLat: 6.5064,
      pickupLng: 3.3547,
      deliveryAddress: '33 Fola Osibo Street, Lekki Phase 1, Lagos',
      deliveryLat: 6.4367,
      deliveryLng: 3.4825,
      packageDescription: 'Medical kits (fragile)',
      weightKg: 2.1,
      notes: 'Deliver to security desk',
      estimatedDelivery: hoursAgo(-1),
      createdAt: hoursAgo(6),
    },
  });

  await prisma.orderStatusLog.createMany({
    data: [
      {
        orderId: order21.id,
        fromStatus: OrderStatus.PENDING,
        toStatus: OrderStatus.ASSIGNED,
        changedById: dispatcher1.id,
        createdAt: hoursAgo(6),
      },
      {
        orderId: order21.id,
        fromStatus: OrderStatus.ASSIGNED,
        toStatus: OrderStatus.ACCEPTED,
        changedById: driver6.id,
        createdAt: hoursAgo(5),
      },
      {
        orderId: order21.id,
        fromStatus: OrderStatus.ACCEPTED,
        toStatus: OrderStatus.PICKED_UP,
        changedById: driver6.id,
        createdAt: hoursAgo(4),
      },
      {
        orderId: order21.id,
        fromStatus: OrderStatus.PICKED_UP,
        toStatus: OrderStatus.IN_TRANSIT,
        changedById: driver6.id,
        createdAt: hoursAgo(3),
      },
      {
        orderId: order21.id,
        fromStatus: OrderStatus.IN_TRANSIT,
        toStatus: OrderStatus.OUT_FOR_DELIVERY,
        changedById: driver6.id,
        createdAt: minsAgo(45),
      },
    ],
  });

  await prisma.locationPing.createMany({
    data: [
      {
        orderId: order21.id,
        driverId: driver6.id,
        lat: 6.474,
        lng: 3.404,
        speed: 20,
        heading: 110,
        createdAt: minsAgo(40),
      },
      {
        orderId: order21.id,
        driverId: driver6.id,
        lat: 6.45,
        lng: 3.44,
        speed: 18,
        heading: 105,
        createdAt: minsAgo(20),
      },
      {
        orderId: order21.id,
        driverId: driver6.id,
        lat: 6.438,
        lng: 3.472,
        speed: 12,
        heading: 98,
        createdAt: minsAgo(8),
      },
    ],
  });

  // Order 22 — DELIVERED, driver7
  const order22 = await prisma.order.create({
    data: {
      referenceId: 'SH-SEED022',
      status: OrderStatus.DELIVERED,
      priority: Priority.STANDARD,
      dispatcherId: dispatcher2.id,
      driverId: driver7.id,
      senderName: 'Swift Supplies',
      senderPhone: '+2348100000043',
      recipientName: 'Obinna Okoro',
      recipientPhone: '+2348100000044',
      pickupAddress: '21 Herbert Macaulay Street, Yaba, Lagos',
      pickupLat: 6.5142,
      pickupLng: 3.3727,
      deliveryAddress: '7 Admiralty Way, Lekki Phase 1, Lagos',
      deliveryLat: 6.4295,
      deliveryLng: 3.4748,
      packageDescription: 'Document box',
      weightKg: 1.1,
      estimatedDelivery: daysAgo(1),
      createdAt: daysAgo(2),
    },
  });

  await prisma.orderStatusLog.createMany({
    data: [
      {
        orderId: order22.id,
        fromStatus: OrderStatus.PENDING,
        toStatus: OrderStatus.ASSIGNED,
        changedById: dispatcher2.id,
        createdAt: daysAgo(2),
      },
      {
        orderId: order22.id,
        fromStatus: OrderStatus.ASSIGNED,
        toStatus: OrderStatus.ACCEPTED,
        changedById: driver7.id,
        createdAt: daysAgo(2),
      },
      {
        orderId: order22.id,
        fromStatus: OrderStatus.ACCEPTED,
        toStatus: OrderStatus.PICKED_UP,
        changedById: driver7.id,
        createdAt: daysAgo(2),
      },
      {
        orderId: order22.id,
        fromStatus: OrderStatus.PICKED_UP,
        toStatus: OrderStatus.IN_TRANSIT,
        changedById: driver7.id,
        createdAt: daysAgo(1),
      },
      {
        orderId: order22.id,
        fromStatus: OrderStatus.IN_TRANSIT,
        toStatus: OrderStatus.OUT_FOR_DELIVERY,
        changedById: driver7.id,
        createdAt: daysAgo(1),
      },
      {
        orderId: order22.id,
        fromStatus: OrderStatus.OUT_FOR_DELIVERY,
        toStatus: OrderStatus.DELIVERED,
        changedById: driver7.id,
        createdAt: daysAgo(1),
      },
    ],
  });

  await prisma.proofOfDelivery.create({
    data: {
      orderId: order22.id,
      signedBy: 'Obinna Okoro',
      notes: 'Delivered to reception.',
      uploadedAt: daysAgo(1),
    },
  });

  // Order 23 — DELIVERED, driver8
  const order23 = await prisma.order.create({
    data: {
      referenceId: 'SH-SEED023',
      status: OrderStatus.DELIVERED,
      priority: Priority.EXPRESS,
      dispatcherId: dispatcher1.id,
      driverId: driver8.id,
      senderName: 'Konga Warehouse',
      senderPhone: '+2348100000045',
      recipientName: 'Tosin Alabi',
      recipientPhone: '+2348100000046',
      pickupAddress: '23 Ozumba Mbadiwe Avenue, Victoria Island, Lagos',
      pickupLat: 6.4229,
      pickupLng: 3.4282,
      deliveryAddress: '44 Allen Avenue, Ikeja, Lagos',
      deliveryLat: 6.6018,
      deliveryLng: 3.3515,
      packageDescription: 'Small appliance',
      weightKg: 4.2,
      estimatedDelivery: daysAgo(2),
      createdAt: daysAgo(3),
    },
  });

  await prisma.orderStatusLog.createMany({
    data: [
      {
        orderId: order23.id,
        fromStatus: OrderStatus.PENDING,
        toStatus: OrderStatus.ASSIGNED,
        changedById: dispatcher1.id,
        createdAt: daysAgo(3),
      },
      {
        orderId: order23.id,
        fromStatus: OrderStatus.ASSIGNED,
        toStatus: OrderStatus.ACCEPTED,
        changedById: driver8.id,
        createdAt: daysAgo(3),
      },
      {
        orderId: order23.id,
        fromStatus: OrderStatus.ACCEPTED,
        toStatus: OrderStatus.PICKED_UP,
        changedById: driver8.id,
        createdAt: daysAgo(2),
      },
      {
        orderId: order23.id,
        fromStatus: OrderStatus.PICKED_UP,
        toStatus: OrderStatus.IN_TRANSIT,
        changedById: driver8.id,
        createdAt: daysAgo(2),
      },
      {
        orderId: order23.id,
        fromStatus: OrderStatus.IN_TRANSIT,
        toStatus: OrderStatus.OUT_FOR_DELIVERY,
        changedById: driver8.id,
        createdAt: daysAgo(2),
      },
      {
        orderId: order23.id,
        fromStatus: OrderStatus.OUT_FOR_DELIVERY,
        toStatus: OrderStatus.DELIVERED,
        changedById: driver8.id,
        createdAt: daysAgo(2),
      },
    ],
  });

  await prisma.proofOfDelivery.create({
    data: {
      orderId: order23.id,
      signedBy: 'Tosin Alabi',
      notes: 'Delivered to recipient at front desk.',
      uploadedAt: daysAgo(2),
    },
  });

  // Order 24 — FAILED, driver9
  const order24 = await prisma.order.create({
    data: {
      referenceId: 'SH-SEED024',
      status: OrderStatus.FAILED,
      priority: Priority.STANDARD,
      dispatcherId: dispatcher2.id,
      driverId: driver9.id,
      senderName: 'Lagos Book Store',
      senderPhone: '+2348100000047',
      recipientName: 'Yewande Sadiq',
      recipientPhone: '+2348100000048',
      pickupAddress: '45 Broad Street, Lagos Island, Lagos',
      pickupLat: 6.4527,
      pickupLng: 3.3915,
      deliveryAddress: '56 Adeniran Ogunsanya Street, Surulere, Lagos',
      deliveryLat: 6.5024,
      deliveryLng: 3.353,
      packageDescription: 'Textbooks (box of 6)',
      weightKg: 9.5,
      failedAttempts: 1,
      estimatedDelivery: daysAgo(1),
      createdAt: daysAgo(2),
    },
  });

  await prisma.orderStatusLog.createMany({
    data: [
      {
        orderId: order24.id,
        fromStatus: OrderStatus.PENDING,
        toStatus: OrderStatus.ASSIGNED,
        changedById: dispatcher2.id,
        createdAt: daysAgo(2),
      },
      {
        orderId: order24.id,
        fromStatus: OrderStatus.ASSIGNED,
        toStatus: OrderStatus.ACCEPTED,
        changedById: driver9.id,
        createdAt: daysAgo(2),
      },
      {
        orderId: order24.id,
        fromStatus: OrderStatus.ACCEPTED,
        toStatus: OrderStatus.PICKED_UP,
        changedById: driver9.id,
        createdAt: daysAgo(1),
      },
      {
        orderId: order24.id,
        fromStatus: OrderStatus.PICKED_UP,
        toStatus: OrderStatus.IN_TRANSIT,
        changedById: driver9.id,
        createdAt: daysAgo(1),
      },
      {
        orderId: order24.id,
        fromStatus: OrderStatus.IN_TRANSIT,
        toStatus: OrderStatus.OUT_FOR_DELIVERY,
        changedById: driver9.id,
        createdAt: daysAgo(1),
      },
      {
        orderId: order24.id,
        fromStatus: OrderStatus.OUT_FOR_DELIVERY,
        toStatus: OrderStatus.FAILED,
        changedById: driver9.id,
        note: 'Recipient refused delivery',
        createdAt: daysAgo(1),
      },
    ],
  });

  await prisma.proofOfDelivery.create({
    data: {
      orderId: order24.id,
      failReason: FailReason.REFUSED,
      failureNotes: 'Recipient refused to accept the package.',
      uploadedAt: daysAgo(1),
    },
  });

  // Order 25 — RESCHEDULED, driver10
  const order25 = await prisma.order.create({
    data: {
      referenceId: 'SH-SEED025',
      status: OrderStatus.RESCHEDULED,
      priority: Priority.EXPRESS,
      dispatcherId: dispatcher1.id,
      driverId: driver10.id,
      senderName: 'TechZone VI',
      senderPhone: '+2348100000049',
      recipientName: 'Bola Ogun',
      recipientPhone: '+2348100000050',
      pickupAddress: '8 Adeola Odeku Street, Victoria Island, Lagos',
      pickupLat: 6.4281,
      pickupLng: 3.4219,
      deliveryAddress: '21 Herbert Macaulay Street, Yaba, Lagos',
      deliveryLat: 6.5142,
      deliveryLng: 3.3727,
      packageDescription: 'Gaming accessories',
      weightKg: 3.8,
      failedAttempts: 1,
      estimatedDelivery: daysFromNow(1),
      createdAt: daysAgo(2),
    },
  });

  await prisma.orderStatusLog.createMany({
    data: [
      {
        orderId: order25.id,
        fromStatus: OrderStatus.PENDING,
        toStatus: OrderStatus.ASSIGNED,
        changedById: dispatcher1.id,
        createdAt: daysAgo(2),
      },
      {
        orderId: order25.id,
        fromStatus: OrderStatus.ASSIGNED,
        toStatus: OrderStatus.ACCEPTED,
        changedById: driver10.id,
        createdAt: daysAgo(2),
      },
      {
        orderId: order25.id,
        fromStatus: OrderStatus.ACCEPTED,
        toStatus: OrderStatus.PICKED_UP,
        changedById: driver10.id,
        createdAt: daysAgo(1),
      },
      {
        orderId: order25.id,
        fromStatus: OrderStatus.PICKED_UP,
        toStatus: OrderStatus.IN_TRANSIT,
        changedById: driver10.id,
        createdAt: daysAgo(1),
      },
      {
        orderId: order25.id,
        fromStatus: OrderStatus.IN_TRANSIT,
        toStatus: OrderStatus.OUT_FOR_DELIVERY,
        changedById: driver10.id,
        createdAt: daysAgo(1),
      },
      {
        orderId: order25.id,
        fromStatus: OrderStatus.OUT_FOR_DELIVERY,
        toStatus: OrderStatus.FAILED,
        changedById: driver10.id,
        note: 'Wrong address on file',
        createdAt: daysAgo(1),
      },
      {
        orderId: order25.id,
        fromStatus: OrderStatus.FAILED,
        toStatus: OrderStatus.RESCHEDULED,
        changedById: dispatcher1.id,
        note: 'Recipient shared correct address. Rescheduled.',
        createdAt: hoursAgo(18),
      },
    ],
  });

  // Order 26 — CANCELLED
  const order26 = await prisma.order.create({
    data: {
      referenceId: 'SH-SEED026',
      status: OrderStatus.CANCELLED,
      priority: Priority.STANDARD,
      dispatcherId: dispatcher2.id,
      senderName: 'Swift Supplies',
      senderPhone: '+2348100000051',
      recipientName: 'Hassan Bello',
      recipientPhone: '+2348100000052',
      pickupAddress: '12 Marina Street, Lagos Island, Lagos',
      pickupLat: 6.4484,
      pickupLng: 3.3948,
      deliveryAddress: '102 Awolowo Road, Ikoyi, Lagos',
      deliveryLat: 6.4502,
      deliveryLng: 3.4384,
      packageDescription: 'Printer paper (box)',
      weightKg: 5.0,
      estimatedDelivery: daysFromNow(1),
      createdAt: hoursAgo(10),
    },
  });

  await prisma.orderStatusLog.createMany({
    data: [
      {
        orderId: order26.id,
        fromStatus: OrderStatus.PENDING,
        toStatus: OrderStatus.CANCELLED,
        changedById: dispatcher2.id,
        note: 'Sender requested cancellation',
        createdAt: hoursAgo(9),
      },
    ],
  });

  // Order 27 — IN_TRANSIT, driver10
  const order27 = await prisma.order.create({
    data: {
      referenceId: 'SH-SEED027',
      status: OrderStatus.IN_TRANSIT,
      priority: Priority.STANDARD,
      dispatcherId: dispatcher1.id,
      driverId: driver10.id,
      senderName: 'Jumia Express Hub',
      senderPhone: '+2348100000053',
      recipientName: 'Ngozi Ayo',
      recipientPhone: '+2348100000054',
      pickupAddress: '8 Adeola Odeku Street, Victoria Island, Lagos',
      pickupLat: 6.4281,
      pickupLng: 3.4219,
      deliveryAddress: '33 Fola Osibo Street, Lekki Phase 1, Lagos',
      deliveryLat: 6.4367,
      deliveryLng: 3.4825,
      packageDescription: 'Home appliance parts',
      weightKg: 6.0,
      estimatedDelivery: hoursAgo(-2),
      createdAt: hoursAgo(7),
    },
  });

  await prisma.orderStatusLog.createMany({
    data: [
      {
        orderId: order27.id,
        fromStatus: OrderStatus.PENDING,
        toStatus: OrderStatus.ASSIGNED,
        changedById: dispatcher1.id,
        createdAt: hoursAgo(7),
      },
      {
        orderId: order27.id,
        fromStatus: OrderStatus.ASSIGNED,
        toStatus: OrderStatus.ACCEPTED,
        changedById: driver10.id,
        createdAt: hoursAgo(6),
      },
      {
        orderId: order27.id,
        fromStatus: OrderStatus.ACCEPTED,
        toStatus: OrderStatus.PICKED_UP,
        changedById: driver10.id,
        createdAt: hoursAgo(5),
      },
      {
        orderId: order27.id,
        fromStatus: OrderStatus.PICKED_UP,
        toStatus: OrderStatus.IN_TRANSIT,
        changedById: driver10.id,
        createdAt: hoursAgo(4),
      },
    ],
  });

  await prisma.locationPing.createMany({
    data: [
      {
        orderId: order27.id,
        driverId: driver10.id,
        lat: 6.4281,
        lng: 3.4219,
        speed: 0,
        createdAt: hoursAgo(4),
      },
      {
        orderId: order27.id,
        driverId: driver10.id,
        lat: 6.432,
        lng: 3.44,
        speed: 24,
        heading: 90,
        createdAt: minsAgo(100),
      },
      {
        orderId: order27.id,
        driverId: driver10.id,
        lat: 6.435,
        lng: 3.46,
        speed: 19,
        heading: 92,
        createdAt: minsAgo(40),
      },
    ],
  });

  // Order 28 — OUT_FOR_DELIVERY, driver5
  const order28 = await prisma.order.create({
    data: {
      referenceId: 'SH-SEED028',
      status: OrderStatus.OUT_FOR_DELIVERY,
      priority: Priority.EXPRESS,
      dispatcherId: dispatcher2.id,
      driverId: driver5.id,
      senderName: 'Zenith Electronics',
      senderPhone: '+2348100000055',
      recipientName: 'Chinwe Umeh',
      recipientPhone: '+2348100000056',
      pickupAddress: '12 Marina Street, Lagos Island, Lagos',
      pickupLat: 6.4484,
      pickupLng: 3.3948,
      deliveryAddress: '21 Herbert Macaulay Street, Yaba, Lagos',
      deliveryLat: 6.5142,
      deliveryLng: 3.3727,
      packageDescription: 'Smartwatch',
      weightKg: 0.4,
      estimatedDelivery: hoursAgo(-1),
      createdAt: hoursAgo(8),
    },
  });

  await prisma.orderStatusLog.createMany({
    data: [
      {
        orderId: order28.id,
        fromStatus: OrderStatus.PENDING,
        toStatus: OrderStatus.ASSIGNED,
        changedById: dispatcher2.id,
        createdAt: hoursAgo(8),
      },
      {
        orderId: order28.id,
        fromStatus: OrderStatus.ASSIGNED,
        toStatus: OrderStatus.ACCEPTED,
        changedById: driver5.id,
        createdAt: hoursAgo(7),
      },
      {
        orderId: order28.id,
        fromStatus: OrderStatus.ACCEPTED,
        toStatus: OrderStatus.PICKED_UP,
        changedById: driver5.id,
        createdAt: hoursAgo(6),
      },
      {
        orderId: order28.id,
        fromStatus: OrderStatus.PICKED_UP,
        toStatus: OrderStatus.IN_TRANSIT,
        changedById: driver5.id,
        createdAt: hoursAgo(5),
      },
      {
        orderId: order28.id,
        fromStatus: OrderStatus.IN_TRANSIT,
        toStatus: OrderStatus.OUT_FOR_DELIVERY,
        changedById: driver5.id,
        createdAt: minsAgo(25),
      },
    ],
  });

  await prisma.locationPing.createMany({
    data: [
      {
        orderId: order28.id,
        driverId: driver5.id,
        lat: 6.46,
        lng: 3.39,
        speed: 22,
        heading: 20,
        createdAt: minsAgo(30),
      },
      {
        orderId: order28.id,
        driverId: driver5.id,
        lat: 6.49,
        lng: 3.38,
        speed: 15,
        heading: 18,
        createdAt: minsAgo(12),
      },
    ],
  });

  // Order 29 — DELIVERED, driver6
  const order29 = await prisma.order.create({
    data: {
      referenceId: 'SH-SEED029',
      status: OrderStatus.DELIVERED,
      priority: Priority.SAME_DAY,
      dispatcherId: dispatcher1.id,
      driverId: driver6.id,
      senderName: 'QuickBite Kitchen',
      senderPhone: '+2348100000057',
      recipientName: 'Sola Anya',
      recipientPhone: '+2348100000058',
      pickupAddress: '15 Opebi Road, Ikeja, Lagos',
      pickupLat: 6.5954,
      pickupLng: 3.3375,
      deliveryAddress: '56 Adeniran Ogunsanya Street, Surulere, Lagos',
      deliveryLat: 6.5024,
      deliveryLng: 3.353,
      packageDescription: 'Catered meal boxes (6 units)',
      weightKg: 5.5,
      notes: 'Call recipient upon arrival',
      estimatedDelivery: daysAgo(1),
      createdAt: daysAgo(2),
    },
  });

  await prisma.orderStatusLog.createMany({
    data: [
      {
        orderId: order29.id,
        fromStatus: OrderStatus.PENDING,
        toStatus: OrderStatus.ASSIGNED,
        changedById: dispatcher1.id,
        createdAt: daysAgo(2),
      },
      {
        orderId: order29.id,
        fromStatus: OrderStatus.ASSIGNED,
        toStatus: OrderStatus.ACCEPTED,
        changedById: driver6.id,
        createdAt: daysAgo(2),
      },
      {
        orderId: order29.id,
        fromStatus: OrderStatus.ACCEPTED,
        toStatus: OrderStatus.PICKED_UP,
        changedById: driver6.id,
        createdAt: daysAgo(1),
      },
      {
        orderId: order29.id,
        fromStatus: OrderStatus.PICKED_UP,
        toStatus: OrderStatus.IN_TRANSIT,
        changedById: driver6.id,
        createdAt: daysAgo(1),
      },
      {
        orderId: order29.id,
        fromStatus: OrderStatus.IN_TRANSIT,
        toStatus: OrderStatus.OUT_FOR_DELIVERY,
        changedById: driver6.id,
        createdAt: daysAgo(1),
      },
      {
        orderId: order29.id,
        fromStatus: OrderStatus.OUT_FOR_DELIVERY,
        toStatus: OrderStatus.DELIVERED,
        changedById: driver6.id,
        createdAt: daysAgo(1),
      },
    ],
  });

  await prisma.proofOfDelivery.create({
    data: {
      orderId: order29.id,
      signedBy: 'Sola Anya',
      notes: 'Delivered warm and sealed.',
      uploadedAt: daysAgo(1),
    },
  });

  // Order 30 — FAILED, driver10
  const order30 = await prisma.order.create({
    data: {
      referenceId: 'SH-SEED030',
      status: OrderStatus.FAILED,
      priority: Priority.STANDARD,
      dispatcherId: dispatcher2.id,
      driverId: driver10.id,
      senderName: 'HomeStyle Furniture',
      senderPhone: '+2348100000059',
      recipientName: 'Kemi Adekunle',
      recipientPhone: '+2348100000060',
      pickupAddress: '12 Marina Street, Lagos Island, Lagos',
      pickupLat: 6.4484,
      pickupLng: 3.3948,
      deliveryAddress: '33 Fola Osibo Street, Lekki Phase 1, Lagos',
      deliveryLat: 6.4367,
      deliveryLng: 3.4825,
      packageDescription: 'Lamp set',
      weightKg: 6.2,
      failedAttempts: 1,
      estimatedDelivery: daysAgo(1),
      createdAt: daysAgo(2),
    },
  });

  await prisma.orderStatusLog.createMany({
    data: [
      {
        orderId: order30.id,
        fromStatus: OrderStatus.PENDING,
        toStatus: OrderStatus.ASSIGNED,
        changedById: dispatcher2.id,
        createdAt: daysAgo(2),
      },
      {
        orderId: order30.id,
        fromStatus: OrderStatus.ASSIGNED,
        toStatus: OrderStatus.ACCEPTED,
        changedById: driver10.id,
        createdAt: daysAgo(2),
      },
      {
        orderId: order30.id,
        fromStatus: OrderStatus.ACCEPTED,
        toStatus: OrderStatus.PICKED_UP,
        changedById: driver10.id,
        createdAt: daysAgo(1),
      },
      {
        orderId: order30.id,
        fromStatus: OrderStatus.PICKED_UP,
        toStatus: OrderStatus.IN_TRANSIT,
        changedById: driver10.id,
        createdAt: daysAgo(1),
      },
      {
        orderId: order30.id,
        fromStatus: OrderStatus.IN_TRANSIT,
        toStatus: OrderStatus.OUT_FOR_DELIVERY,
        changedById: driver10.id,
        createdAt: daysAgo(1),
      },
      {
        orderId: order30.id,
        fromStatus: OrderStatus.OUT_FOR_DELIVERY,
        toStatus: OrderStatus.FAILED,
        changedById: driver10.id,
        note: 'Delivery address unreachable',
        createdAt: daysAgo(1),
      },
    ],
  });

  await prisma.proofOfDelivery.create({
    data: {
      orderId: order30.id,
      failReason: FailReason.WRONG_ADDRESS,
      failureNotes: 'Address could not be located by driver.',
      uploadedAt: daysAgo(1),
    },
  });

  console.log('Orders, status logs, PODs, and location pings created.');

  // ── NOTIFICATIONS ─────────────────────────────────────────────────────────

  await prisma.notification.createMany({
    data: [
      // Admin — system notifications
      {
        userId: admin.id,
        type: NotificationType.SYSTEM_UPDATE,
        channel: NotifChannel.IN_APP,
        title: 'SwiftHaul v1.0 is live',
        body: 'The platform has been deployed successfully. All services are operational.',
        isRead: true,
        createdAt: daysAgo(1),
      },
      {
        userId: admin.id,
        type: NotificationType.DELIVERY_FAILED,
        channel: NotifChannel.IN_APP,
        title: 'Delivery failed — SH-SEED013',
        body: 'David Osei could not deliver to Kelechi Eze. Reason: recipient not home.',
        isRead: false,
        orderId: order13.id,
        createdAt: daysAgo(1),
      },

      // Dispatcher 1 — order activity
      {
        userId: dispatcher1.id,
        type: NotificationType.DELIVERY_COMPLETED,
        channel: NotifChannel.IN_APP,
        title: 'Order delivered — SH-SEED011',
        body: 'Emma Chen delivered order SH-SEED011 to Taiwo Olawale successfully.',
        isRead: false,
        orderId: order11.id,
        createdAt: daysAgo(1),
      },
      {
        userId: dispatcher1.id,
        type: NotificationType.DELIVERY_FAILED,
        channel: NotifChannel.IN_APP,
        title: 'Delivery failed — SH-SEED013',
        body: 'Order SH-SEED013 failed. Recipient was not home. Review and reschedule.',
        isRead: false,
        orderId: order13.id,
        createdAt: daysAgo(1),
      },
      {
        userId: dispatcher1.id,
        type: NotificationType.STATUS_CHANGED,
        channel: NotifChannel.IN_APP,
        title: 'Order out for delivery — SH-SEED009',
        body: 'Emma Chen is now out for delivery on SH-SEED009 (Adaeze Nnaji).',
        isRead: true,
        orderId: order9.id,
        createdAt: minsAgo(30),
      },

      // Dispatcher 2 — order activity
      {
        userId: dispatcher2.id,
        type: NotificationType.DELIVERY_COMPLETED,
        channel: NotifChannel.IN_APP,
        title: 'Order delivered — SH-SEED010',
        body: 'Michael Adeyemi delivered order SH-SEED010 to Emeka Chibuike.',
        isRead: true,
        orderId: order10.id,
        createdAt: daysAgo(1),
      },
      {
        userId: dispatcher2.id,
        type: NotificationType.DELIVERY_COMPLETED,
        channel: NotifChannel.IN_APP,
        title: 'Order delivered — SH-SEED012',
        body: 'David Osei delivered order SH-SEED012 to Grace Okonkwo.',
        isRead: false,
        orderId: order12.id,
        createdAt: daysAgo(2),
      },

      // Driver 1 (Michael) — assignment notifications
      {
        userId: driver1.id,
        type: NotificationType.ORDER_ASSIGNED,
        channel: NotifChannel.IN_APP,
        title: 'New order assigned — SH-SEED007',
        body: 'You have been assigned order SH-SEED007. Pick up from Zenith Electronics, Marina.',
        isRead: true,
        orderId: order7.id,
        createdAt: hoursAgo(5),
      },

      // Driver 2 (Emma) — assignment notifications
      {
        userId: driver2.id,
        type: NotificationType.ORDER_ASSIGNED,
        channel: NotifChannel.IN_APP,
        title: 'New order assigned — SH-SEED009',
        body: 'You have been assigned order SH-SEED009. Same-day delivery — Jumia Express Hub.',
        isRead: true,
        orderId: order9.id,
        createdAt: hoursAgo(8),
      },

      // Driver 3 (David)
      {
        userId: driver3.id,
        type: NotificationType.ORDER_ASSIGNED,
        channel: NotifChannel.IN_APP,
        title: 'New order assigned — SH-SEED008',
        body: 'You have been assigned order SH-SEED008. Lagos Book Store, Broad Street.',
        isRead: true,
        orderId: order8.id,
        createdAt: hoursAgo(6),
      },

      // System broadcast (no userId — visible to all admins/dispatchers)
      {
        userId: null,
        type: NotificationType.SYSTEM_MAINTENANCE,
        channel: NotifChannel.IN_APP,
        title: 'Scheduled maintenance',
        body: 'SwiftHaul will undergo routine maintenance on Sunday 2 AM–4 AM. No downtime expected.',
        isRead: false,
        createdAt: hoursAgo(12),
      },
    ],
  });

  console.log('Notifications created.');
  console.log('');
  console.log('Seeding complete. Credentials:');
  console.log(
    `  Admin:       ${adminEmail}  /  ${process.env.ADMIN_TEMP_PASSWORD ?? DEV_PASSWORD}  (must reset password on first login)`,
  );
  console.log(`  Dispatchers: sarah.parker@swifthaul.com  /  ${DEV_PASSWORD}`);
  console.log(`               james.okoro@swifthaul.com   /  ${DEV_PASSWORD}`);
  console.log(`  Drivers:     mike.adeyemi@swifthaul.com  /  ${DEV_PASSWORD}`);
  console.log(`               emma.chen@swifthaul.com     /  ${DEV_PASSWORD}`);
  console.log(`               david.osei@swifthaul.com    /  ${DEV_PASSWORD}`);
  console.log(`               fatima.hassan@swifthaul.com /  ${DEV_PASSWORD}`);
  console.log(`               chidi.nwachukwu@swifthaul.com / ${DEV_PASSWORD}`);
  console.log(`               aisha.balogun@swifthaul.com   / ${DEV_PASSWORD}`);
  console.log(`               kunle.ajayi@swifthaul.com     / ${DEV_PASSWORD}`);
  console.log(`               zara.bello@swifthaul.com      / ${DEV_PASSWORD}`);
  console.log(`               samuel.okoye@swifthaul.com    / ${DEV_PASSWORD}`);
  console.log(`               lara.ade@swifthaul.com        / ${DEV_PASSWORD}`);
}

main()
  .catch((e) => {
    console.error('Seed failed:', e);
    process.exit(1);
  })
  .finally(() => {
    void prisma.$disconnect();
  });
