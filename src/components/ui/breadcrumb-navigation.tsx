import * as React from "react";
import { ChevronLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

// Ícone Home customizado
const HomeIcon = ({
  className,
  ...props
}: React.SVGProps<SVGSVGElement>) => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={cn("h-4 w-4", className)} {...props}>
    <path d="M2 12.2039C2 9.91549 2 8.77128 2.5192 7.82274C3.0384 6.87421 3.98695 6.28551 5.88403 5.10813L7.88403 3.86687C9.88939 2.62229 10.8921 2 12 2C13.1079 2 14.1106 2.62229 16.116 3.86687L18.116 5.10812C20.0131 6.28551 20.9616 6.87421 21.4808 7.82274C22 8.77128 22 9.91549 22 12.2039V13.725C22 17.6258 22 19.5763 20.8284 20.7881C19.6569 22 17.7712 22 14 22H10C6.22876 22 4.34315 22 3.17157 20.7881C2 19.5763 2 17.6258 2 13.725V12.2039Z" stroke="currentColor" strokeWidth="1.5" />
    <path d="M15 18H9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
  </svg>;
export interface BreadcrumbItem {
  label: string;
  href?: string;
  icon?: "home" | React.ReactNode;
  current?: boolean;
}
export interface BreadcrumbProps {
  path: BreadcrumbItem[];
  onBack?: () => void;
  className?: string;
}
const BreadcrumbContext = React.createContext<{
  onBack?: () => void;
}>({});

// Componente principal
const Breadcrumb = React.forwardRef<HTMLElement, BreadcrumbProps>(({
  path,
  onBack,
  className,
  ...props
}, ref) => {
  const currentItem = path[path.length - 1];
  const hasParent = path.length > 1;
  
  return <BreadcrumbContext.Provider value={{
    onBack
  }}>
      <nav ref={ref} aria-label="Breadcrumb" className={cn("flex items-center h-12 gap-2", className)} {...props}>
        {/* Mobile: Mostrar apenas item atual com ícone home se for página inicial */}
        <div className="flex md:hidden items-center gap-2">
          {hasParent && onBack && <BackButton />}
          <BreadcrumbItem item={currentItem} />
        </div>
        
        {/* Desktop: Mostrar botão de voltar + breadcrumb completo */}
        <div className="hidden md:flex items-center gap-2">
          {hasParent && onBack && <BackButton />}
          {path.map((item, index) => (
            <div key={index} className="flex items-center gap-2">
              <BreadcrumbItem item={item} />
              {index < path.length - 1 && <Separator />}
            </div>
          ))}
        </div>
      </nav>
    </BreadcrumbContext.Provider>;
});
Breadcrumb.displayName = "Breadcrumb";

// Subcomponente: Botão de voltar
const BackButton = React.forwardRef<HTMLButtonElement, React.ButtonHTMLAttributes<HTMLButtonElement>>(({
  className,
  ...props
}, ref) => {
  const {
    onBack
  } = React.useContext(BreadcrumbContext);
  return <Button ref={ref} variant="secondary" size="icon" onClick={onBack} aria-label="Voltar para a página anterior" className={cn("h-8 w-10 bg-second-primary hover:bg-second-primary/80 border border-border rounded-[6px]", className)} {...props}>
      <svg width="20" height="20" viewBox="0 0 16 12" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M14.6666 6H1.33325M1.33325 6L6.33325 1M1.33325 6L6.33325 11" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    </Button>;
});
BackButton.displayName = "BackButton";

// Subcomponente: Item do breadcrumb
const BreadcrumbItem = React.forwardRef<HTMLDivElement, {
  item: BreadcrumbItem;
  className?: string;
}>(({
  item,
  className
}, ref) => {
  const content = <div ref={ref} className={cn("flex items-center gap-2 text-base md:text-lg font-sora font-semibold", item.current ? "text-second-dark cursor-default" : "text-second-black hover:text-main-black cursor-pointer transition-colors", className)} {...item.current && {
    "aria-current": "page"
  }}>
      {item.icon && <>
          {item.icon === "home" ? <HomeIcon className="h-4 w-4 md:h-5 md:w-5" /> : item.icon}
        </>}
      <span className="truncate max-w-[200px] md:max-w-none">{item.label}</span>
    </div>;
  if (item.current || !item.href) {
    return content;
  }
  return <a href={item.href} className="no-underline">
      {content}
    </a>;
});
BreadcrumbItem.displayName = "BreadcrumbItem";

// Subcomponente: Separador
const Separator = React.forwardRef<HTMLSpanElement, React.HTMLAttributes<HTMLSpanElement>>(({
  className,
  ...props
}, ref) => <span ref={ref} role="presentation" aria-hidden="true" className={cn("text-second-black font-bold mx-0.5 text-xl", className)} {...props}>
    /
  </span>);
Separator.displayName = "Separator";

// Exportações para composição
const BreadcrumbWithSubcomponents = Object.assign(Breadcrumb, {
  BackButton,
  Item: BreadcrumbItem,
  Separator
});
export { BreadcrumbWithSubcomponents as Breadcrumb, BackButton as BreadcrumbBackButton, BreadcrumbItem, Separator as BreadcrumbSeparator };