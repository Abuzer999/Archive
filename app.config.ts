export default defineAppConfig({
  ui: {
    toast: {
      slots: {
        root: "relative group overflow-hidden bg-[#fff] dark:bg-[#242629]  shadow-lg rounded-[calc(var(--ui-radius)*2)] ring ring-[#EDEDF5] dark:ring-[#161616] p-4 flex gap-2.5 focus:outline-none",
        wrapper: "w-0 flex-1 flex flex-col",
        title: "text-sm font-medium text-(--ui-text-highlighted)",
        description: "text-sm text-(--ui-text-muted)",
        icon: "shrink-0 size-5",
        avatar: "shrink-0",
        avatarSize: "2xl",
        actions: "flex gap-1.5 shrink-0",
        progress: "absolute inset-x-0 bottom-0 h-1 z-[-1]",
        close: "p-0",
      },
      variants: {
        color: {
          primary: {
            root: "focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-(--ui-primary)",
            icon: "text-(--ui-primary)",
            progress: "bg-(--ui-primary)",
          },
          secondary: {
            root: "focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-(--ui-secondary)",
            icon: "text-(--ui-secondary)",
            progress: "bg-(--ui-secondary)",
          },
          success: {
            root: "focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-(--ui-success)",
            icon: "text-(--ui-success)",
            progress: "bg-(--ui-success)",
          },
          info: {
            root: "focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-(--ui-info)",
            icon: "text-(--ui-info)",
            progress: "bg-(--ui-info)",
          },
          warning: {
            root: "focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-(--ui-warning)",
            icon: "text-(--ui-warning)",
            progress: "bg-(--ui-warning)",
          },
          error: {
            root: "focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-(--ui-error)",
            icon: "text-(--ui-error)",
            progress: "bg-(--ui-error)",
          },
          neutral: {
            root: "focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-(--ui-border-inverted)",
            icon: "text-(--ui-text-highlighted)",
            progress: "bg-(--ui-bg-inverted)",
          },
        },
        orientation: {
          horizontal: {
            root: "items-center",
            actions: "items-center",
          },
          vertical: {
            root: "items-start",
            actions: "items-start mt-2.5",
          },
        },
        title: {
          true: {
            description: "mt-1",
          },
        },
      },
      defaultVariants: {
        color: "primary",
      },
    },
    avatar: {
      slots: {
        root: "inline-flex items-center justify-center shrink-0 select-none overflow-hidden rounded-full align-middle bg-(--ui-bg-elevated)",
        image: "h-full w-full rounded-[inherit] object-cover",
        fallback:
          "font-medium leading-none text-[#242629] dark:text-white  truncate",
        icon: "text-(--ui-text-muted) shrink-0",
      },
      variants: {
        size: {
          "3xs": {
            root: "size-4 text-[8px]",
          },
          "2xs": {
            root: "size-5 text-[10px]",
          },
          xs: {
            root: "size-6 text-xs",
          },
          sm: {
            root: "size-7 text-sm",
          },
          md: {
            root: "size-8 text-base",
          },
          lg: {
            root: "size-9 text-lg",
          },
          xl: {
            root: "size-10 text-xl",
          },
          "2xl": {
            root: "size-11 text-[22px]",
          },
          "3xl": {
            root: "size-12 text-2xl",
          },
        },
      },
      defaultVariants: {
        size: "md",
      },
    },
    modal: {
      slots: {
        overlay: "fixed inset-0 bg-(--ui-bg-elevated)/75",
        content:
          "fixed border-[1px] border-solid border-[#fbfbfc] dark:border-[#1c1e22] bg-[#fff] dark:bg-[#242629] flex flex-col focus:outline-none",
        header: "flex items-center gap-1.5 p-4 sm:px-6 min-h-16 border-none",
        wrapper: "",
        body: "flex-1 overflow-y-auto p-4 sm:p-6 border-none",
        footer: "flex items-center gap-1.5 p-4 sm:px-6",
        title: "text-(--ui-text-highlighted) font-semibold",
        description: "mt-1 text-(--ui-text-muted) text-sm",
        close: "absolute top-4 end-4",
      },
      variants: {
        transition: {
          true: {
            overlay:
              "data-[state=open]:animate-[fade-in_200ms_ease-out] data-[state=closed]:animate-[fade-out_200ms_ease-in]",
            content:
              "data-[state=open]:animate-[scale-in_200ms_ease-out] data-[state=closed]:animate-[scale-out_200ms_ease-in]",
          },
        },
        fullscreen: {
          true: {
            content: "inset-0",
          },
          false: {
            content:
              "top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[calc(100vw-2rem)] max-w-lg max-h-[calc(100dvh-2rem)] sm:max-h-[calc(100dvh-4rem)] rounded-[calc(var(--ui-radius)*2)] shadow-lg",
          },
        },
      },
    },
    button: {
      compoundVariants: [
        {
          color: "primary",
          variant: "solid",
          class:
            "text-white bg-amber-300 hover:bg-amber-400 disabled:text-white",
        },
      ],
    },
  },
});
