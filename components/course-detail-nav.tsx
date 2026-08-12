"use client";

const items = [
  ["Tổng quan", "#overview"],
  ["Thông tin K2", ".k2-info-block"],
  ["Đối tượng", ".audience-block"],
  ["Nội dung học", "#curriculum"],
  ["Giảng viên", "#instructor"],
  ["Phản hồi", ".course-feedback-section"],
  ["Liên hệ", ".purchase-card"],
] as const;

export function CourseDetailNav({isK2}:{isK2:boolean}) {
  return <nav className="detail-tabs" aria-label="Điều hướng nội dung khóa học">
    {items.filter(([label])=>isK2||label!=="Thông tin K2").map(([label,target])=><button type="button" key={target} onClick={()=>document.querySelector(target)?.scrollIntoView({behavior:"smooth",block:"start"})}>{label}</button>)}
  </nav>;
}
