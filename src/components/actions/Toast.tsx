import { Toast as ToastPrimitive } from "radix-ui";

type ToastProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  duration?: number;
};

export default function Toast({
  open,
  onOpenChange,
  title,
  description,
  actionLabel,
  onAction,
  duration = 5000,
}: Readonly<ToastProps>) {
  return (
    <ToastPrimitive.Provider swipeDirection="right">
      <ToastPrimitive.Root
        open={open}
        onOpenChange={onOpenChange}
        duration={duration}
        className="grid grid-cols-[1fr_auto] items-center gap-x-4 rounded-md border-2 border-navy bg-cream p-4 text-left shadow-lg data-[state=open]:animate-toast-in data-[state=closed]:animate-toast-out data-[swipe=move]:translate-x-[var(--radix-toast-swipe-move-x)] data-[swipe=cancel]:translate-x-0 data-[swipe=cancel]:transition-transform data-[swipe=end]:animate-toast-swipe-out"
      >
        <ToastPrimitive.Title className="col-start-1 row-start-1 font-medium text-navy">
          {title}
        </ToastPrimitive.Title>

        {description && (
          <ToastPrimitive.Description className="col-start-1 row-start-2 mt-1 text-sm text-steel">
            {description}
          </ToastPrimitive.Description>
        )}

        {actionLabel && (
          <ToastPrimitive.Action
            asChild
            altText={actionLabel}
            className="col-start-2 row-span-2 row-start-1"
          >
            <button
              type="button"
              onClick={onAction}
              className="cursor-pointer rounded-sm bg-navy px-3 py-1.5 text-sm text-cream hover:bg-steel"
            >
              {actionLabel}
            </button>
          </ToastPrimitive.Action>
        )}
      </ToastPrimitive.Root>

      <ToastPrimitive.Viewport className="fixed bottom-0 right-0 z-50 m-0 flex w-full max-w-[100vw] sm:w-96 list-none flex-col gap-2 p-4 sm:p-6 outline-none" />
    </ToastPrimitive.Provider>
  );
}
