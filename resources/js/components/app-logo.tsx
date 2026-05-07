import { BookOpenText } from 'lucide-react';

export default function AppLogo() {
    return (
        <>
            <div className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <BookOpenText className="size-4" />
            </div>
            <div className="ml-1 grid flex-1 text-left text-sm">
                <span className="truncate leading-none font-semibold">HSalam</span>
                <span className="truncate text-[10px] text-muted-foreground">SMP Al Azhar 20</span>
            </div>
        </>
    );
}
