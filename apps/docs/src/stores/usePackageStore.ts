import { create } from 'zustand'

export const packages = ['core', 'react'] as const

export type Package = (typeof packages)[number]

export function isPackage(str: string): str is Package {
  return packages.includes(str as Package)
}

interface PackageStore {
  selectedPackage: Package
  setSelectedPackage: (pkg: Package) => void
}

export const usePackageStore = create<PackageStore>((set) => ({
  selectedPackage: 'core',
  setSelectedPackage: (pkg) => set({ selectedPackage: pkg }),
}))

/* const packages = [
  {
    name: 'Core',
    description: 'Get started with the essentials',
    href: '##',
    icon: IconOne,
  },
  {
    name: 'React',
    description: 'Build interactive UIs with React',
    href: '##',
    icon: IconTwo,
  },
] */
