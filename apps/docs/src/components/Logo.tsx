import Image from 'next/image'
import logo from '@/images/logos/logo.png'

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
      {/* Credit: <a href="https://www.flaticon.com/free-icons/cyber-security" title="cyber security icons">Cyber security icons created by Ardiansyah - Flaticon</a>  */}

      <span className="text-xl font-bold bg-gradient-to-l from-[#a79dff] via-[#b2c1ff] via-[#aacbff] to-[#93d0ff] text-transparent bg-clip-text">NestJS-Cognito</span>
    </div>
  )
}
