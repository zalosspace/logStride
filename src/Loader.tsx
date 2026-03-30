import { useGSAP } from '@gsap/react'
import gsap from 'gsap'

export default function Loader() {
    useGSAP(()=>{
        let tl = gsap.timeline()
        tl.from('#loader p',{
            x:15,
            opacity: 0,
            stagger: 0.1,
            duration:0.6,
        })
        tl.to('#loader p',{
            x:-10,
            opacity: 0,
            stagger: 0.1,
            duration:0.6,
        })
        tl.to('#loader',{
            opacity: 0
        })
        tl.to('#loader',{
            display: 'none'
        })
    })

    return (
    <div
  id="loader"
  className="fixed top-0 left-0 w-full h-screen flex items-center justify-center bg-black z-50"
>
  <div className="flex items-center gap-2 sm:gap-3 -mt-16 text-white text-[10vw] sm:text-[7vw] font-semibold">
    <p>Log</p>
    <p className="text-[var(--hint)] brightness-110">Stride</p>
  </div>
</div>)
}
