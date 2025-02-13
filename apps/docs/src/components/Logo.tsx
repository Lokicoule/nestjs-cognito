import Image from 'next/image'
import logo from '@/images/logos/logo.jpg'

export function Logo(props: React.ComponentPropsWithoutRef<'svg'>) {
  return (
    <div className="flex items-center gap-2">
      <Image
        src={logo}
        alt="nestjs-cognito logo"
        width={32}
        height={32}
        className="rounded-lg"
      />
      <span className="text-md font-bold">NestJS-Cognito</span>
    </div>
  )
}
