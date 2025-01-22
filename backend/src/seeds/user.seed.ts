import { prisma } from "../db";

async function main() {
  const seedUsers = [
    {
      email: "william.clark@example.com",
      fullName: "William Clark",
      password: "123456",
      profilePic: "https://randomuser.me/api/portraits/men/2.jpg",
    },
    {
      email: "benjamin.taylor@example.com",
      fullName: "Benjamin Taylor",
      password: "123456",
      profilePic: "https://randomuser.me/api/portraits/men/3.jpg",
    },
    {
      email: "lucas.moore@example.com",
      fullName: "Lucas Moore",
      password: "123456",
      profilePic: "https://randomuser.me/api/portraits/men/4.jpg",
    },
    {
      email: "henry.jackson@example.com",
      fullName: "Henry Jackson",
      password: "123456",
      profilePic: "https://randomuser.me/api/portraits/men/5.jpg",
    },
    {
      email: "alexander.martin@example.com",
      fullName: "Alexander Martin",
      password: "123456",
      profilePic: "https://randomuser.me/api/portraits/men/6.jpg",
    },
    {
      email: "daniel.rodriguez@example.com",
      fullName: "Daniel Rodriguez",
      password: "123456",
      profilePic: "https://randomuser.me/api/portraits/men/7.jpg",
    },
  ];

  for (const user of seedUsers) {
    await prisma.user.create({
      data: user,
    });
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
