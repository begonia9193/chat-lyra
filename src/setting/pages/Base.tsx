import { memo } from "react";

export const Base = memo(() => {
  return (
    <div className='w-full h-full of-y-auto'>
      <div className="setting-item">
        <div className="mb-16px font-500 text-16px">
          基础设置
        </div>
        <div>
          123
        </div>
      </div>
    </div>
  )
})
