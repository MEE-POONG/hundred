export default function Loading() {
    return (
        <div className="flex flex-col items-center justify-center p-12 text-center h-[50vh]">
            <div className="relative w-16 h-16 rounded-full border-4 border-white/10 mb-4 animate-spin border-t-[rgb(var(--primary))]"></div>
            <p className="text-[rgb(var(--text-muted))] animate-pulse">กำลังโหลดข้อมูล...</p>
        </div>
    );
}
