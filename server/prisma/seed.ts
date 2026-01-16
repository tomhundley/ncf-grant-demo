/**
 * =============================================================================
 * Database Seed Script
 * =============================================================================
 *
 * Populates the database with realistic demo data for the NCF Grant Management
 * system. Uses real ministry names and categories to demonstrate the system.
 *
 * Run with: npx prisma db seed
 * Or: npm run db:seed
 */

import { PrismaClient, MinistryCategory } from '@prisma/client';
import { Decimal } from '@prisma/client/runtime/library';

const prisma = new PrismaClient();

/**
 * Seed data for ministries - real organizations for realistic demo
 */
const ministries = [
  {
    name: "Samaritan's Purse",
    ein: '58-1437002',
    category: 'HUMANITARIAN' as MinistryCategory,
    description:
      'International relief and evangelism organization providing spiritual and physical aid to hurting people around the world.',
    mission:
      'Following the example of Christ by helping those in need and sharing the Good News of salvation.',
    website: 'https://www.samaritanspurse.org',
    city: 'Boone',
    state: 'NC',
    verified: true,
    active: true,
  },
  {
    name: 'Compassion International',
    ein: '36-2423707',
    category: 'HUMANITARIAN' as MinistryCategory,
    description:
      'Child sponsorship organization dedicated to the long-term development of children living in poverty.',
    mission:
      'Releasing children from poverty in Jesus name.',
    website: 'https://www.compassion.com',
    city: 'Colorado Springs',
    state: 'CO',
    verified: true,
    active: true,
  },
  {
    name: 'Cru (Campus Crusade for Christ)',
    ein: '95-6006173',
    category: 'MISSIONS' as MinistryCategory,
    description:
      'Interdenominational Christian parachurch organization for evangelism and discipleship.',
    mission:
      'Helping to fulfill the Great Commission in the power of the Holy Spirit.',
    website: 'https://www.cru.org',
    city: 'Orlando',
    state: 'FL',
    verified: true,
    active: true,
  },
  {
    name: 'Young Life',
    ein: '84-0385934',
    category: 'YOUTH' as MinistryCategory,
    description:
      'Youth outreach ministry reaching middle school, high school, and college students.',
    mission:
      'Introducing adolescents to Jesus Christ and helping them grow in their faith.',
    website: 'https://www.younglife.org',
    city: 'Colorado Springs',
    state: 'CO',
    verified: true,
    active: true,
  },
  {
    name: 'Focus on the Family',
    ein: '95-3188150',
    category: 'MEDIA' as MinistryCategory,
    description:
      'Christian ministry providing family advice from a biblical perspective through radio, publications, and counseling.',
    mission:
      'Helping families thrive in Christ.',
    website: 'https://www.focusonthefamily.com',
    city: 'Colorado Springs',
    state: 'CO',
    verified: true,
    active: true,
  },
  {
    name: 'Wheaton College',
    ein: '36-2167892',
    category: 'EDUCATION' as MinistryCategory,
    description:
      'Private Christian liberal arts college committed to academic excellence and spiritual growth.',
    mission:
      'For Christ and His Kingdom.',
    website: 'https://www.wheaton.edu',
    city: 'Wheaton',
    state: 'IL',
    verified: true,
    active: true,
  },
  {
    name: 'Fellowship of Christian Athletes',
    ein: '44-0610626',
    category: 'YOUTH' as MinistryCategory,
    description:
      'Sports ministry reaching coaches and athletes on the professional, college, high school, and youth levels.',
    mission:
      'To lead every coach and athlete into a growing relationship with Jesus Christ.',
    website: 'https://www.fca.org',
    city: 'Kansas City',
    state: 'MO',
    verified: true,
    active: true,
  },
  {
    name: 'World Vision',
    ein: '95-1922279',
    category: 'HUMANITARIAN' as MinistryCategory,
    description:
      'Christian humanitarian organization dedicated to working with children, families, and communities to overcome poverty and injustice.',
    mission:
      'Following Jesus Christ in working with the poor and oppressed.',
    website: 'https://www.worldvision.org',
    city: 'Federal Way',
    state: 'WA',
    verified: true,
    active: true,
  },
  {
    name: 'The Navigators',
    ein: '84-0402270',
    category: 'MISSIONS' as MinistryCategory,
    description:
      'International, interdenominational Christian ministry focused on discipleship and spiritual formation.',
    mission:
      'To know Christ, make Him known, and help others do the same.',
    website: 'https://www.navigators.org',
    city: 'Colorado Springs',
    state: 'CO',
    verified: true,
    active: true,
  },
  {
    name: 'First Baptist Church Atlanta',
    ein: '58-0566194',
    category: 'CHURCH' as MinistryCategory,
    description:
      'Historic Southern Baptist church in downtown Atlanta with global missions reach.',
    mission:
      'Glorifying God by making disciples of all nations.',
    website: 'https://www.fba.org',
    city: 'Atlanta',
    state: 'GA',
    verified: true,
    active: true,
  },
  // Unverified ministry for demo
  {
    name: 'New Hope Community Church',
    ein: '12-3456789',
    category: 'CHURCH' as MinistryCategory,
    description:
      'Growing community church focused on reaching the unchurched in suburban areas.',
    mission:
      'Connecting people to Jesus and each other.',
    website: 'https://www.newhopecommunity.org',
    city: 'Phoenix',
    state: 'AZ',
    verified: false, // Not yet verified
    active: true,
  },
];

/**
 * Seed data for donors
 */
const donors = [
  {
    firstName: 'Robert',
    lastName: 'Thompson',
    email: 'robert.thompson@example.com',
    phone: '555-123-4567',
  },
  {
    firstName: 'Sarah',
    lastName: 'Mitchell',
    email: 'sarah.mitchell@example.com',
    phone: '555-234-5678',
  },
  {
    firstName: 'David',
    lastName: 'Anderson',
    email: 'david.anderson@example.com',
    phone: '555-345-6789',
  },
  {
    firstName: 'Jennifer',
    lastName: 'Williams',
    email: 'jennifer.williams@example.com',
    phone: '555-456-7890',
  },
];

/**
 * Main seed function
 */
async function main(): Promise<void> {
  console.log('🌱 Starting database seed...\n');

  // Clear existing data
  console.log('🗑️  Clearing existing data...');
  await prisma.grant.deleteMany();
  await prisma.givingFund.deleteMany();
  await prisma.donor.deleteMany();
  await prisma.ministry.deleteMany();

  // Seed ministries
  console.log('⛪ Creating ministries...');
  const createdMinistries = await Promise.all(
    ministries.map((m) => prisma.ministry.create({ data: m }))
  );
  console.log(`   Created ${createdMinistries.length} ministries`);

  // Seed donors with giving funds
  console.log('👥 Creating donors and giving funds...');
  const createdDonors = await Promise.all(
    donors.map(async (donor, index) => {
      const createdDonor = await prisma.donor.create({ data: donor });

      // Create giving funds for each donor
      const fundBalance = 50000 + index * 25000; // Varying balances
      await prisma.givingFund.create({
        data: {
          name: `${donor.lastName} Family Giving Fund`,
          description: `Primary giving fund for the ${donor.lastName} family`,
          balance: new Decimal(fundBalance),
          donorId: createdDonor.id,
          active: true,
        },
      });

      // Second fund for first two donors
      if (index < 2) {
        await prisma.givingFund.create({
          data: {
            name: `${donor.lastName} Legacy Fund`,
            description: `Legacy and planned giving fund`,
            balance: new Decimal(100000 + index * 50000),
            donorId: createdDonor.id,
            active: true,
          },
        });
      }

      return createdDonor;
    })
  );
  console.log(`   Created ${createdDonors.length} donors`);

  const allFunds = await prisma.givingFund.findMany();
  console.log(`   Created ${allFunds.length} giving funds`);

  // Seed grants in various statuses
  console.log('💰 Creating grants...');
  const verifiedMinistries = createdMinistries.filter((m) => m.verified);

  // Create some grants with different statuses
  const grants = [
    // Pending grants
    {
      amount: new Decimal(5000),
      status: 'PENDING' as const,
      purpose: 'Support for disaster relief efforts',
      givingFundId: allFunds[0]!.id,
      ministryId: verifiedMinistries[0]!.id, // Samaritan's Purse
    },
    {
      amount: new Decimal(2500),
      status: 'PENDING' as const,
      purpose: 'Child sponsorship program',
      givingFundId: allFunds[1]!.id,
      ministryId: verifiedMinistries[1]!.id, // Compassion
    },
    // Approved grants (awaiting funding)
    {
      amount: new Decimal(10000),
      status: 'APPROVED' as const,
      purpose: 'Campus ministry expansion',
      givingFundId: allFunds[0]!.id,
      ministryId: verifiedMinistries[2]!.id, // Cru
      approvedAt: new Date(),
    },
    {
      amount: new Decimal(7500),
      status: 'APPROVED' as const,
      purpose: 'Summer camp scholarships',
      givingFundId: allFunds[2]!.id,
      ministryId: verifiedMinistries[3]!.id, // Young Life
      approvedAt: new Date(),
    },
    // Funded grants
    {
      amount: new Decimal(15000),
      status: 'FUNDED' as const,
      purpose: 'Annual operating support',
      givingFundId: allFunds[0]!.id,
      ministryId: verifiedMinistries[4]!.id, // Focus on the Family
      approvedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
      fundedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
    },
    {
      amount: new Decimal(25000),
      status: 'FUNDED' as const,
      purpose: 'Scholarship endowment',
      givingFundId: allFunds[3]!.id,
      ministryId: verifiedMinistries[5]!.id, // Wheaton College
      approvedAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
      fundedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
    },
    {
      amount: new Decimal(3000),
      status: 'FUNDED' as const,
      purpose: 'Athletes Bible study materials',
      givingFundId: allFunds[1]!.id,
      ministryId: verifiedMinistries[6]!.id, // FCA
      approvedAt: new Date(Date.now() - 21 * 24 * 60 * 60 * 1000),
      fundedAt: new Date(Date.now() - 18 * 24 * 60 * 60 * 1000),
    },
    // Rejected grant
    {
      amount: new Decimal(50000),
      status: 'REJECTED' as const,
      purpose: 'Building expansion project',
      notes: 'Rejection reason: Amount exceeds fund advisor recommended limit for single grants',
      givingFundId: allFunds[2]!.id,
      ministryId: verifiedMinistries[7]!.id, // World Vision
      rejectedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    },
  ];

  await Promise.all(grants.map((g) => prisma.grant.create({ data: g })));
  console.log(`   Created ${grants.length} grants`);

  // Summary
  console.log('\n✅ Seed completed successfully!\n');
  console.log('📊 Summary:');
  console.log(`   - ${createdMinistries.length} ministries (${verifiedMinistries.length} verified)`);
  console.log(`   - ${createdDonors.length} donors`);
  console.log(`   - ${allFunds.length} giving funds`);
  console.log(`   - ${grants.length} grants`);
  console.log(
    `     • Pending: ${grants.filter((g) => g.status === 'PENDING').length}`
  );
  console.log(
    `     • Approved: ${grants.filter((g) => g.status === 'APPROVED').length}`
  );
  console.log(
    `     • Funded: ${grants.filter((g) => g.status === 'FUNDED').length}`
  );
  console.log(
    `     • Rejected: ${grants.filter((g) => g.status === 'REJECTED').length}`
  );
}

// Execute seed
main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
