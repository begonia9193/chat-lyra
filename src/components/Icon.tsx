import cn from 'classnames'
import type { DetailedHTMLProps, HTMLAttributes } from 'react'

interface IconProps
    extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
    icon?: string
    size?: string
    className?: string
    onClick?: (event: React.MouseEvent<HTMLSpanElement>) => void
}


export function Icon(props: IconProps) {
    const { icon, size = 'size-16px', className, ...rest } = props

    return <div className={cn(icon, size, className)} {...rest} />
}
