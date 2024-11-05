import ms from 'ms'

export const timeAgo = (timestamp: Date, timeOnly?: boolean, positive?: boolean): string => {
    if (!timestamp) return 'never'
    
    const diff = Date.now() - new Date(timestamp).getTime()
    const absDiff = positive ? Math.abs(diff) : diff
    
    return `${ms(absDiff)}${timeOnly ? '' : (diff > 0 ? ' ago' : ' remaining')}`
}