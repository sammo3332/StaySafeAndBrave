export type PackageId = 'basis' | 'standard' | 'premium';

export interface PackageDefinition {
  id: PackageId;
  name: string;
  shortDescription: string;
  description?: string;
  priceAmount?: number;
  priceLabel?: string;
  features?: string[];
  active: boolean;
  sortOrder: number;
}

const PACKAGES: Record<PackageId, PackageDefinition> = {
  basis: {
    id: 'basis',
    name: 'Basis',
    shortDescription: 'Begleitpaket mit persönlichem Local Mentor.',
    description: 'Die konkreten Leistungen und Preise dieses Pakets werden derzeit final abgestimmt.',
    priceLabel: 'In Abstimmung',
    active: true,
    sortOrder: 1,
  },
  standard: {
    id: 'standard',
    name: 'Standard',
    shortDescription: 'Begleitpaket mit persönlichem Local Mentor.',
    description: 'Die konkreten Leistungen und Preise dieses Pakets werden derzeit final abgestimmt.',
    priceLabel: 'In Abstimmung',
    active: true,
    sortOrder: 2,
  },
  premium: {
    id: 'premium',
    name: 'Premium',
    shortDescription: 'Begleitpaket mit persönlichem Local Mentor.',
    description: 'Die konkreten Leistungen und Preise dieses Pakets werden derzeit final abgestimmt.',
    priceLabel: 'In Abstimmung',
    active: true,
    sortOrder: 3,
  },
};

export function getPackages(): PackageDefinition[] {
  return Object.values(PACKAGES).sort((a, b) => a.sortOrder - b.sortOrder);
}

export function getPackageById(id: PackageId | string): PackageDefinition | undefined {
  return Object.values(PACKAGES).find((pkg) => pkg.id === id);
}
