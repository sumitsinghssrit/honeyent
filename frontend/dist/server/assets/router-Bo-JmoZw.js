import { K as logout } from "./clients-DsHCc4c7.js";
import { n as cn, t as Button } from "./button-C1KSxKmF.js";
import { t as Badge } from "./badge-eXqQHFo7.js";
import { a as useErp, i as loadBackendData, n as active, o as useTheme } from "./store-D7jRh-xR.js";
import { n as useAlerts } from "./alert-center-DeNcqAS5.js";
import { t as Input } from "./input-CCCvLIdb.js";
import { n as DialogContent, t as Dialog } from "./dialog-BFWVuur3.js";
import { t as OneShotOrderDialog } from "./one-shot-order-z4tGHdij.js";
import * as React from "react";
import { useEffect, useMemo, useState } from "react";
import { HeadContent, Link, Outlet, Scripts, createFileRoute, createRootRouteWithContext, createRouter, lazyRouteComponent, useNavigate, useRouter, useRouterState } from "@tanstack/react-router";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AlertTriangle, BarChart3, Bell, BookOpen, Bus, Command, Factory, IdCard, Info, Layers, LayoutDashboard, LogOut, Moon, Mountain, Package, PanelLeft, RadioTower, Receipt, Route, Scale, Search, Settings, ShieldAlert, ShoppingCart, Sparkles, Sun, Truck, Users, Wallet, X } from "lucide-react";
import * as PopoverPrimitive from "@radix-ui/react-popover";
import { cva } from "class-variance-authority";
import { Slot } from "@radix-ui/react-slot";
import * as SeparatorPrimitive from "@radix-ui/react-separator";
import * as SheetPrimitive from "@radix-ui/react-dialog";
import * as TooltipPrimitive from "@radix-ui/react-tooltip";
import { Toaster } from "sonner";
import { Command as Command$1 } from "cmdk";
//#region src/components/ui/popover.tsx
var Popover = PopoverPrimitive.Root;
var PopoverTrigger = PopoverPrimitive.Trigger;
var PopoverContent = React.forwardRef(({ className, align = "center", sideOffset = 4, ...props }, ref) => /* @__PURE__ */ jsx(PopoverPrimitive.Portal, { children: /* @__PURE__ */ jsx(PopoverPrimitive.Content, {
	ref,
	align,
	sideOffset,
	className: cn("z-50 w-72 rounded-md border bg-popover p-4 text-popover-foreground shadow-md outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 origin-(--radix-popover-content-transform-origin)", className),
	...props
}) }));
PopoverContent.displayName = PopoverPrimitive.Content.displayName;
//#endregion
//#region src/styles.css?url
var styles_default = "/assets/styles-B2vZgj5p.css";
//#endregion
//#region src/lib/lovable-error-reporting.ts
function reportLovableError(error, context = {}) {
	if (typeof window === "undefined") return;
	window.__lovableEvents?.captureException?.(error, {
		source: "react_error_boundary",
		route: window.location.pathname,
		...context
	}, {
		mechanism: "react_error_boundary",
		handled: false,
		severity: "error"
	});
}
//#endregion
//#region src/hooks/use-mobile.tsx
var MOBILE_BREAKPOINT = 768;
function useIsMobile() {
	const [isMobile, setIsMobile] = React.useState(void 0);
	React.useEffect(() => {
		const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`);
		const onChange = () => {
			setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
		};
		mql.addEventListener("change", onChange);
		setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
		return () => mql.removeEventListener("change", onChange);
	}, []);
	return !!isMobile;
}
//#endregion
//#region src/components/ui/separator.tsx
var Separator = React.forwardRef(({ className, orientation = "horizontal", decorative = true, ...props }, ref) => /* @__PURE__ */ jsx(SeparatorPrimitive.Root, {
	ref,
	decorative,
	orientation,
	className: cn("shrink-0 bg-border", orientation === "horizontal" ? "h-[1px] w-full" : "h-full w-[1px]", className),
	...props
}));
Separator.displayName = SeparatorPrimitive.Root.displayName;
//#endregion
//#region src/components/ui/sheet.tsx
var Sheet = SheetPrimitive.Root;
var SheetPortal = SheetPrimitive.Portal;
var SheetOverlay = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(SheetPrimitive.Overlay, {
	className: cn("fixed inset-0 z-50 bg-black/80  data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0", className),
	...props,
	ref
}));
SheetOverlay.displayName = SheetPrimitive.Overlay.displayName;
var sheetVariants = cva("fixed z-50 gap-4 bg-background p-6 shadow-lg transition ease-in-out data-[state=closed]:duration-300 data-[state=open]:duration-500 data-[state=open]:animate-in data-[state=closed]:animate-out", {
	variants: { side: {
		top: "inset-x-0 top-0 border-b data-[state=closed]:slide-out-to-top data-[state=open]:slide-in-from-top",
		bottom: "inset-x-0 bottom-0 border-t data-[state=closed]:slide-out-to-bottom data-[state=open]:slide-in-from-bottom",
		left: "inset-y-0 left-0 h-full w-3/4 border-r data-[state=closed]:slide-out-to-left data-[state=open]:slide-in-from-left sm:max-w-sm",
		right: "inset-y-0 right-0 h-full w-3/4 border-l data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right sm:max-w-sm"
	} },
	defaultVariants: { side: "right" }
});
var SheetContent = React.forwardRef(({ side = "right", className, children, ...props }, ref) => /* @__PURE__ */ jsxs(SheetPortal, { children: [/* @__PURE__ */ jsx(SheetOverlay, {}), /* @__PURE__ */ jsxs(SheetPrimitive.Content, {
	ref,
	className: cn(sheetVariants({ side }), className),
	...props,
	children: [/* @__PURE__ */ jsxs(SheetPrimitive.Close, {
		className: "absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background cursor-pointer transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-secondary",
		children: [/* @__PURE__ */ jsx(X, { className: "h-4 w-4" }), /* @__PURE__ */ jsx("span", {
			className: "sr-only",
			children: "Close"
		})]
	}), children]
})] }));
SheetContent.displayName = SheetPrimitive.Content.displayName;
var SheetHeader = ({ className, ...props }) => /* @__PURE__ */ jsx("div", {
	className: cn("flex flex-col space-y-2 text-center sm:text-left", className),
	...props
});
SheetHeader.displayName = "SheetHeader";
var SheetFooter = ({ className, ...props }) => /* @__PURE__ */ jsx("div", {
	className: cn("flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2", className),
	...props
});
SheetFooter.displayName = "SheetFooter";
var SheetTitle = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(SheetPrimitive.Title, {
	ref,
	className: cn("text-lg font-semibold text-foreground", className),
	...props
}));
SheetTitle.displayName = SheetPrimitive.Title.displayName;
var SheetDescription = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(SheetPrimitive.Description, {
	ref,
	className: cn("text-sm text-muted-foreground", className),
	...props
}));
SheetDescription.displayName = SheetPrimitive.Description.displayName;
//#endregion
//#region src/components/ui/skeleton.tsx
function Skeleton({ className, ...props }) {
	return /* @__PURE__ */ jsx("div", {
		className: cn("animate-pulse rounded-md bg-primary/10", className),
		...props
	});
}
//#endregion
//#region src/components/ui/tooltip.tsx
var TooltipProvider = TooltipPrimitive.Provider;
var Tooltip = TooltipPrimitive.Root;
var TooltipTrigger = TooltipPrimitive.Trigger;
var TooltipContent = React.forwardRef(({ className, sideOffset = 4, ...props }, ref) => /* @__PURE__ */ jsx(TooltipPrimitive.Portal, { children: /* @__PURE__ */ jsx(TooltipPrimitive.Content, {
	ref,
	sideOffset,
	className: cn("z-50 overflow-hidden rounded-md bg-primary px-3 py-1.5 text-xs text-primary-foreground animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 origin-(--radix-tooltip-content-transform-origin)", className),
	...props
}) }));
TooltipContent.displayName = TooltipPrimitive.Content.displayName;
//#endregion
//#region src/components/ui/sidebar.tsx
var SIDEBAR_COOKIE_NAME = "sidebar_state";
var SIDEBAR_COOKIE_MAX_AGE = 3600 * 24 * 7;
var SIDEBAR_WIDTH = "16rem";
var SIDEBAR_WIDTH_MOBILE = "18rem";
var SIDEBAR_WIDTH_ICON = "3rem";
var SIDEBAR_KEYBOARD_SHORTCUT = "b";
var SidebarContext = React.createContext(null);
function useSidebar() {
	const context = React.useContext(SidebarContext);
	if (!context) throw new Error("useSidebar must be used within a SidebarProvider.");
	return context;
}
var SidebarProvider = React.forwardRef(({ defaultOpen = true, open: openProp, onOpenChange: setOpenProp, className, style, children, ...props }, ref) => {
	const isMobile = useIsMobile();
	const [openMobile, setOpenMobile] = React.useState(false);
	const [_open, _setOpen] = React.useState(defaultOpen);
	const open = openProp ?? _open;
	const setOpen = React.useCallback((value) => {
		const openState = typeof value === "function" ? value(open) : value;
		if (setOpenProp) setOpenProp(openState);
		else _setOpen(openState);
		document.cookie = `${SIDEBAR_COOKIE_NAME}=${openState}; path=/; max-age=${SIDEBAR_COOKIE_MAX_AGE}`;
	}, [setOpenProp, open]);
	const toggleSidebar = React.useCallback(() => {
		return isMobile ? setOpenMobile((open) => !open) : setOpen((open) => !open);
	}, [
		isMobile,
		setOpen,
		setOpenMobile
	]);
	React.useEffect(() => {
		const handleKeyDown = (event) => {
			if (event.key === SIDEBAR_KEYBOARD_SHORTCUT && (event.metaKey || event.ctrlKey)) {
				event.preventDefault();
				toggleSidebar();
			}
		};
		window.addEventListener("keydown", handleKeyDown);
		return () => window.removeEventListener("keydown", handleKeyDown);
	}, [toggleSidebar]);
	const state = open ? "expanded" : "collapsed";
	const contextValue = React.useMemo(() => ({
		state,
		open,
		setOpen,
		isMobile,
		openMobile,
		setOpenMobile,
		toggleSidebar
	}), [
		state,
		open,
		setOpen,
		isMobile,
		openMobile,
		setOpenMobile,
		toggleSidebar
	]);
	return /* @__PURE__ */ jsx(SidebarContext.Provider, {
		value: contextValue,
		children: /* @__PURE__ */ jsx(TooltipProvider, {
			delayDuration: 0,
			children: /* @__PURE__ */ jsx("div", {
				style: {
					"--sidebar-width": SIDEBAR_WIDTH,
					"--sidebar-width-icon": SIDEBAR_WIDTH_ICON,
					...style
				},
				className: cn("group/sidebar-wrapper flex min-h-svh w-full has-[[data-variant=inset]]:bg-sidebar", className),
				ref,
				...props,
				children
			})
		})
	});
});
SidebarProvider.displayName = "SidebarProvider";
var Sidebar = React.forwardRef(({ side = "left", variant = "sidebar", collapsible = "offcanvas", className, children, ...props }, ref) => {
	const { isMobile, state, openMobile, setOpenMobile } = useSidebar();
	if (collapsible === "none") return /* @__PURE__ */ jsx("div", {
		className: cn("flex h-full w-(--sidebar-width) flex-col bg-sidebar text-sidebar-foreground", className),
		ref,
		...props,
		children
	});
	if (isMobile) return /* @__PURE__ */ jsx(Sheet, {
		open: openMobile,
		onOpenChange: setOpenMobile,
		...props,
		children: /* @__PURE__ */ jsxs(SheetContent, {
			"data-sidebar": "sidebar",
			"data-mobile": "true",
			className: "w-(--sidebar-width) bg-sidebar p-0 text-sidebar-foreground [&>button]:hidden",
			style: { "--sidebar-width": SIDEBAR_WIDTH_MOBILE },
			side,
			children: [/* @__PURE__ */ jsxs(SheetHeader, {
				className: "sr-only",
				children: [/* @__PURE__ */ jsx(SheetTitle, { children: "Sidebar" }), /* @__PURE__ */ jsx(SheetDescription, { children: "Displays the mobile sidebar." })]
			}), /* @__PURE__ */ jsx("div", {
				className: "flex h-full w-full flex-col",
				children
			})]
		})
	});
	return /* @__PURE__ */ jsxs("div", {
		ref,
		className: "group peer hidden text-sidebar-foreground md:block",
		"data-state": state,
		"data-collapsible": state === "collapsed" ? collapsible : "",
		"data-variant": variant,
		"data-side": side,
		children: [/* @__PURE__ */ jsx("div", { className: cn("relative w-(--sidebar-width) bg-transparent transition-[width] duration-200 ease-linear", "group-data-[collapsible=offcanvas]:w-0", "group-data-[side=right]:rotate-180", variant === "floating" || variant === "inset" ? "group-data-[collapsible=icon]:w-[calc(var(--sidebar-width-icon)_+_theme(spacing.4))]" : "group-data-[collapsible=icon]:w-(--sidebar-width-icon)") }), /* @__PURE__ */ jsx("div", {
			className: cn("fixed inset-y-0 z-10 hidden h-svh w-(--sidebar-width) transition-[left,right,width] duration-200 ease-linear md:flex", side === "left" ? "left-0 group-data-[collapsible=offcanvas]:left-[calc(var(--sidebar-width)*-1)]" : "right-0 group-data-[collapsible=offcanvas]:right-[calc(var(--sidebar-width)*-1)]", variant === "floating" || variant === "inset" ? "p-2 group-data-[collapsible=icon]:w-[calc(var(--sidebar-width-icon)_+_theme(spacing.4)_+2px)]" : "group-data-[collapsible=icon]:w-(--sidebar-width-icon) group-data-[side=left]:border-r group-data-[side=right]:border-l", className),
			...props,
			children: /* @__PURE__ */ jsx("div", {
				"data-sidebar": "sidebar",
				className: "flex h-full w-full flex-col bg-sidebar group-data-[variant=floating]:rounded-lg group-data-[variant=floating]:border group-data-[variant=floating]:border-sidebar-border group-data-[variant=floating]:shadow",
				children
			})
		})]
	});
});
Sidebar.displayName = "Sidebar";
var SidebarTrigger = React.forwardRef(({ className, onClick, ...props }, ref) => {
	const { toggleSidebar } = useSidebar();
	return /* @__PURE__ */ jsxs(Button, {
		ref,
		"data-sidebar": "trigger",
		variant: "ghost",
		size: "icon",
		className: cn("h-7 w-7", className),
		onClick: (event) => {
			onClick?.(event);
			toggleSidebar();
		},
		...props,
		children: [/* @__PURE__ */ jsx(PanelLeft, {}), /* @__PURE__ */ jsx("span", {
			className: "sr-only",
			children: "Toggle Sidebar"
		})]
	});
});
SidebarTrigger.displayName = "SidebarTrigger";
var SidebarRail = React.forwardRef(({ className, ...props }, ref) => {
	const { toggleSidebar } = useSidebar();
	return /* @__PURE__ */ jsx("button", {
		ref,
		"data-sidebar": "rail",
		"aria-label": "Toggle Sidebar",
		tabIndex: -1,
		onClick: toggleSidebar,
		title: "Toggle Sidebar",
		className: cn("absolute inset-y-0 z-20 hidden w-4 -translate-x-1/2 transition-all ease-linear after:absolute after:inset-y-0 after:left-1/2 after:w-[2px] hover:after:bg-sidebar-border group-data-[side=left]:-right-4 group-data-[side=right]:left-0 sm:flex", "[[data-side=left]_&]:cursor-w-resize [[data-side=right]_&]:cursor-e-resize", "[[data-side=left][data-state=collapsed]_&]:cursor-e-resize [[data-side=right][data-state=collapsed]_&]:cursor-w-resize", "group-data-[collapsible=offcanvas]:translate-x-0 group-data-[collapsible=offcanvas]:after:left-full group-data-[collapsible=offcanvas]:hover:bg-sidebar", "[[data-side=left][data-collapsible=offcanvas]_&]:-right-2", "[[data-side=right][data-collapsible=offcanvas]_&]:-left-2", className),
		...props
	});
});
SidebarRail.displayName = "SidebarRail";
var SidebarInset = React.forwardRef(({ className, ...props }, ref) => {
	return /* @__PURE__ */ jsx("main", {
		ref,
		className: cn("relative flex w-full flex-1 flex-col bg-background", "md:peer-data-[variant=inset]:m-2 md:peer-data-[state=collapsed]:peer-data-[variant=inset]:ml-2 md:peer-data-[variant=inset]:ml-0 md:peer-data-[variant=inset]:rounded-xl md:peer-data-[variant=inset]:shadow", className),
		...props
	});
});
SidebarInset.displayName = "SidebarInset";
var SidebarInput = React.forwardRef(({ className, ...props }, ref) => {
	return /* @__PURE__ */ jsx(Input, {
		ref,
		"data-sidebar": "input",
		className: cn("h-8 w-full bg-background shadow-none focus-visible:ring-2 focus-visible:ring-sidebar-ring", className),
		...props
	});
});
SidebarInput.displayName = "SidebarInput";
var SidebarHeader = React.forwardRef(({ className, ...props }, ref) => {
	return /* @__PURE__ */ jsx("div", {
		ref,
		"data-sidebar": "header",
		className: cn("flex flex-col gap-2 p-2", className),
		...props
	});
});
SidebarHeader.displayName = "SidebarHeader";
var SidebarFooter = React.forwardRef(({ className, ...props }, ref) => {
	return /* @__PURE__ */ jsx("div", {
		ref,
		"data-sidebar": "footer",
		className: cn("flex flex-col gap-2 p-2", className),
		...props
	});
});
SidebarFooter.displayName = "SidebarFooter";
var SidebarSeparator = React.forwardRef(({ className, ...props }, ref) => {
	return /* @__PURE__ */ jsx(Separator, {
		ref,
		"data-sidebar": "separator",
		className: cn("mx-2 w-auto bg-sidebar-border", className),
		...props
	});
});
SidebarSeparator.displayName = "SidebarSeparator";
var SidebarContent = React.forwardRef(({ className, ...props }, ref) => {
	return /* @__PURE__ */ jsx("div", {
		ref,
		"data-sidebar": "content",
		className: cn("flex min-h-0 flex-1 flex-col gap-2 overflow-auto group-data-[collapsible=icon]:overflow-hidden", className),
		...props
	});
});
SidebarContent.displayName = "SidebarContent";
var SidebarGroup = React.forwardRef(({ className, ...props }, ref) => {
	return /* @__PURE__ */ jsx("div", {
		ref,
		"data-sidebar": "group",
		className: cn("relative flex w-full min-w-0 flex-col p-2", className),
		...props
	});
});
SidebarGroup.displayName = "SidebarGroup";
var SidebarGroupLabel = React.forwardRef(({ className, asChild = false, ...props }, ref) => {
	return /* @__PURE__ */ jsx(asChild ? Slot : "div", {
		ref,
		"data-sidebar": "group-label",
		className: cn("flex h-8 shrink-0 items-center rounded-md px-2 text-xs font-medium text-sidebar-foreground/70 outline-none ring-sidebar-ring transition-[margin,opacity] duration-200 ease-linear focus-visible:ring-2 [&>svg]:size-4 [&>svg]:shrink-0", "group-data-[collapsible=icon]:-mt-8 group-data-[collapsible=icon]:opacity-0", className),
		...props
	});
});
SidebarGroupLabel.displayName = "SidebarGroupLabel";
var SidebarGroupAction = React.forwardRef(({ className, asChild = false, ...props }, ref) => {
	return /* @__PURE__ */ jsx(asChild ? Slot : "button", {
		ref,
		"data-sidebar": "group-action",
		className: cn("absolute right-3 top-3.5 flex aspect-square w-5 items-center justify-center rounded-md p-0 text-sidebar-foreground outline-none ring-sidebar-ring cursor-pointer transition-transform hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 [&>svg]:size-4 [&>svg]:shrink-0", "after:absolute after:-inset-2 after:md:hidden", "group-data-[collapsible=icon]:hidden", className),
		...props
	});
});
SidebarGroupAction.displayName = "SidebarGroupAction";
var SidebarGroupContent = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx("div", {
	ref,
	"data-sidebar": "group-content",
	className: cn("w-full text-sm", className),
	...props
}));
SidebarGroupContent.displayName = "SidebarGroupContent";
var SidebarMenu = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx("ul", {
	ref,
	"data-sidebar": "menu",
	className: cn("flex w-full min-w-0 flex-col gap-1", className),
	...props
}));
SidebarMenu.displayName = "SidebarMenu";
var SidebarMenuItem = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx("li", {
	ref,
	"data-sidebar": "menu-item",
	className: cn("group/menu-item relative", className),
	...props
}));
SidebarMenuItem.displayName = "SidebarMenuItem";
var sidebarMenuButtonVariants = cva("peer/menu-button flex w-full items-center gap-2 overflow-hidden rounded-md p-2 text-left text-sm outline-none ring-sidebar-ring cursor-pointer transition-[width,height,padding] hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 active:bg-sidebar-accent active:text-sidebar-accent-foreground disabled:pointer-events-none disabled:opacity-50 disabled:cursor-not-allowed group-has-[[data-sidebar=menu-action]]/menu-item:pr-8 aria-disabled:pointer-events-none aria-disabled:opacity-50 data-[active=true]:bg-sidebar-accent data-[active=true]:font-medium data-[active=true]:text-sidebar-accent-foreground data-[state=open]:hover:bg-sidebar-accent data-[state=open]:hover:text-sidebar-accent-foreground group-data-[collapsible=icon]:!size-8 group-data-[collapsible=icon]:!p-2 [&>span:last-child]:truncate [&>svg]:size-4 [&>svg]:shrink-0", {
	variants: {
		variant: {
			default: "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
			outline: "bg-background shadow-[0_0_0_1px_var(--sidebar-border)] hover:bg-sidebar-accent hover:text-sidebar-accent-foreground hover:shadow-[0_0_0_1px_var(--sidebar-accent)]"
		},
		size: {
			default: "h-8 text-sm",
			sm: "h-7 text-xs",
			lg: "h-12 text-sm group-data-[collapsible=icon]:!p-0"
		}
	},
	defaultVariants: {
		variant: "default",
		size: "default"
	}
});
var SidebarMenuButton = React.forwardRef(({ asChild = false, isActive = false, variant = "default", size = "default", tooltip, className, ...props }, ref) => {
	const Comp = asChild ? Slot : "button";
	const { isMobile, state } = useSidebar();
	const button = /* @__PURE__ */ jsx(Comp, {
		ref,
		"data-sidebar": "menu-button",
		"data-size": size,
		"data-active": isActive,
		className: cn(sidebarMenuButtonVariants({
			variant,
			size
		}), className),
		...props
	});
	if (!tooltip) return button;
	if (typeof tooltip === "string") tooltip = { children: tooltip };
	return /* @__PURE__ */ jsxs(Tooltip, { children: [/* @__PURE__ */ jsx(TooltipTrigger, {
		asChild: true,
		children: button
	}), /* @__PURE__ */ jsx(TooltipContent, {
		side: "right",
		align: "center",
		hidden: state !== "collapsed" || isMobile,
		...tooltip
	})] });
});
SidebarMenuButton.displayName = "SidebarMenuButton";
var SidebarMenuAction = React.forwardRef(({ className, asChild = false, showOnHover = false, ...props }, ref) => {
	return /* @__PURE__ */ jsx(asChild ? Slot : "button", {
		ref,
		"data-sidebar": "menu-action",
		className: cn("absolute right-1 top-1.5 flex aspect-square w-5 items-center justify-center rounded-md p-0 text-sidebar-foreground outline-none ring-sidebar-ring cursor-pointer transition-transform hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 peer-hover/menu-button:text-sidebar-accent-foreground [&>svg]:size-4 [&>svg]:shrink-0", "after:absolute after:-inset-2 after:md:hidden", "peer-data-[size=sm]/menu-button:top-1", "peer-data-[size=default]/menu-button:top-1.5", "peer-data-[size=lg]/menu-button:top-2.5", "group-data-[collapsible=icon]:hidden", showOnHover && "group-focus-within/menu-item:opacity-100 group-hover/menu-item:opacity-100 data-[state=open]:opacity-100 peer-data-[active=true]/menu-button:text-sidebar-accent-foreground md:opacity-0", className),
		...props
	});
});
SidebarMenuAction.displayName = "SidebarMenuAction";
var SidebarMenuBadge = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx("div", {
	ref,
	"data-sidebar": "menu-badge",
	className: cn("pointer-events-none absolute right-1 flex h-5 min-w-5 select-none items-center justify-center rounded-md px-1 text-xs font-medium tabular-nums text-sidebar-foreground", "peer-hover/menu-button:text-sidebar-accent-foreground peer-data-[active=true]/menu-button:text-sidebar-accent-foreground", "peer-data-[size=sm]/menu-button:top-1", "peer-data-[size=default]/menu-button:top-1.5", "peer-data-[size=lg]/menu-button:top-2.5", "group-data-[collapsible=icon]:hidden", className),
	...props
}));
SidebarMenuBadge.displayName = "SidebarMenuBadge";
var SidebarMenuSkeleton = React.forwardRef(({ className, showIcon = false, ...props }, ref) => {
	const width = React.useMemo(() => {
		return `${Math.floor(Math.random() * 40) + 50}%`;
	}, []);
	return /* @__PURE__ */ jsxs("div", {
		ref,
		"data-sidebar": "menu-skeleton",
		className: cn("flex h-8 items-center gap-2 rounded-md px-2", className),
		...props,
		children: [showIcon && /* @__PURE__ */ jsx(Skeleton, {
			className: "size-4 rounded-md",
			"data-sidebar": "menu-skeleton-icon"
		}), /* @__PURE__ */ jsx(Skeleton, {
			className: "h-4 max-w-(--skeleton-width) flex-1",
			"data-sidebar": "menu-skeleton-text",
			style: { "--skeleton-width": width }
		})]
	});
});
SidebarMenuSkeleton.displayName = "SidebarMenuSkeleton";
var SidebarMenuSub = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx("ul", {
	ref,
	"data-sidebar": "menu-sub",
	className: cn("mx-3.5 flex min-w-0 translate-x-px flex-col gap-1 border-l border-sidebar-border px-2.5 py-0.5", "group-data-[collapsible=icon]:hidden", className),
	...props
}));
SidebarMenuSub.displayName = "SidebarMenuSub";
var SidebarMenuSubItem = React.forwardRef(({ ...props }, ref) => /* @__PURE__ */ jsx("li", {
	ref,
	...props
}));
SidebarMenuSubItem.displayName = "SidebarMenuSubItem";
var SidebarMenuSubButton = React.forwardRef(({ asChild = false, size = "md", isActive, className, ...props }, ref) => {
	return /* @__PURE__ */ jsx(asChild ? Slot : "a", {
		ref,
		"data-sidebar": "menu-sub-button",
		"data-size": size,
		"data-active": isActive,
		className: cn("flex h-7 min-w-0 -translate-x-px items-center gap-2 overflow-hidden rounded-md px-2 text-sidebar-foreground outline-none ring-sidebar-ring cursor-pointer hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 active:bg-sidebar-accent active:text-sidebar-accent-foreground disabled:pointer-events-none disabled:opacity-50 disabled:cursor-not-allowed aria-disabled:pointer-events-none aria-disabled:opacity-50 [&>span:last-child]:truncate [&>svg]:size-4 [&>svg]:shrink-0 [&>svg]:text-sidebar-accent-foreground", "data-[active=true]:bg-sidebar-accent data-[active=true]:text-sidebar-accent-foreground", size === "sm" && "text-xs", size === "md" && "text-sm", "group-data-[collapsible=icon]:hidden", className),
		...props
	});
});
SidebarMenuSubButton.displayName = "SidebarMenuSubButton";
//#endregion
//#region src/components/app-sidebar.tsx
var sections = [
	{
		label: "Overview",
		items: [{
			title: "Dashboard",
			url: "/",
			icon: LayoutDashboard
		}]
	},
	{
		label: "Operations",
		items: [
			{
				title: "Deal Register",
				url: "/deals",
				icon: Receipt
			},
			{
				title: "Operations Register",
				url: "/operations",
				icon: Layers
			},
			{
				title: "Orders Page",
				url: "/orders",
				icon: ShoppingCart
			},
			{
				title: "Weigh Slip",
				url: "/weighbridge",
				icon: Scale
			},
			{
				title: "Trip Details",
				url: "/trips",
				icon: Truck
			},
			{
				title: "Delivery Challan",
				url: "/dispatch",
				icon: Receipt
			},
			{
				title: "Sales Invoices",
				url: "/saleinvoice",
				icon: Receipt
			},
			{
				title: "Purchase Invoices",
				url: "/purchaseinvoice",
				icon: Receipt
			}
		]
	},
	{
		label: "Masters",
		items: [
			{
				title: "Customers",
				url: "/customers",
				icon: Users
			},
			{
				title: "Suppliers",
				url: "/suppliers",
				icon: Factory
			},
			{
				title: "Products",
				url: "/products",
				icon: Package
			},
			{
				title: "Vehicles",
				url: "/vehicles",
				icon: Bus
			},
			{
				title: "Drivers",
				url: "/drivers",
				icon: IdCard
			},
			{
				title: "HSN Codes",
				url: "/hsn",
				icon: BookOpen
			},
			{
				title: "Expense Heads",
				url: "/expensesheads",
				icon: BookOpen
			}
		]
	},
	{
		label: "Finance",
		items: [
			{
				title: "Reports",
				url: "/reports",
				icon: BarChart3
			},
			{
				title: "Control Tower",
				url: "/control-tower",
				icon: RadioTower
			},
			{
				title: "Executive Dashboard",
				url: "/executive",
				icon: Wallet
			},
			{
				title: "Ledger",
				url: "/ledger",
				icon: IdCard
			},
			{
				title: "Cashbook",
				url: "/cashbook",
				icon: Wallet
			},
			{
				title: "Expenses",
				url: "/expenses",
				icon: Wallet
			}
		]
	},
	{
		label: "Setup",
		items: [{
			title: "Settings",
			url: "/settings",
			icon: Settings
		}]
	}
];
function AppSidebar() {
	const pathname = useRouterState({ select: (s) => s.location.pathname });
	const isActive = (url) => {
		if (url === "/") return pathname === "/";
		return typeof pathname === "string" && pathname.startsWith(url);
	};
	return /* @__PURE__ */ jsxs(Sidebar, {
		collapsible: "icon",
		children: [/* @__PURE__ */ jsx(SidebarHeader, {
			className: "border-b border-sidebar-border",
			children: /* @__PURE__ */ jsxs("div", {
				className: "flex items-center gap-2 px-2 py-1.5",
				children: [/* @__PURE__ */ jsx("div", {
					className: "flex h-9 w-9 items-center justify-center rounded-md bg-primary text-primary-foreground",
					children: /* @__PURE__ */ jsx(Mountain, { className: "h-5 w-5" })
				}), /* @__PURE__ */ jsxs("div", {
					className: "flex flex-col leading-tight group-data-[collapsible=icon]:hidden",
					children: [/* @__PURE__ */ jsx("span", {
						className: "font-display text-sm font-semibold tracking-tight",
						children: "Honey Enterprises"
					}), /* @__PURE__ */ jsx("span", {
						className: "text-[10px] uppercase tracking-[0.18em] text-sidebar-foreground/60",
						children: "Stone & Transport ERP"
					})]
				})]
			})
		}), /* @__PURE__ */ jsx(SidebarContent, { children: sections.map((section) => /* @__PURE__ */ jsxs(SidebarGroup, { children: [/* @__PURE__ */ jsx(SidebarGroupLabel, { children: section.label }), /* @__PURE__ */ jsx(SidebarGroupContent, { children: /* @__PURE__ */ jsx(SidebarMenu, { children: section.items.map((item) => /* @__PURE__ */ jsx(SidebarMenuItem, { children: /* @__PURE__ */ jsx(SidebarMenuButton, {
			asChild: true,
			isActive: isActive(item.url),
			tooltip: item.title,
			children: /* @__PURE__ */ jsxs(Link, {
				to: item.url,
				className: "flex items-center gap-2",
				children: [/* @__PURE__ */ jsx(item.icon, { className: "h-4 w-4" }), /* @__PURE__ */ jsx("span", { children: item.title })]
			})
		}) }, item.url)) }) })] }, section.label)) })]
	});
}
//#endregion
//#region src/components/ui/sonner.tsx
var Toaster$1 = ({ ...props }) => {
	return /* @__PURE__ */ jsx(Toaster, {
		className: "toaster group",
		toastOptions: { classNames: {
			toast: "group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg",
			description: "group-[.toast]:text-muted-foreground",
			actionButton: "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
			cancelButton: "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground"
		} },
		...props
	});
};
//#endregion
//#region src/components/ui/command.tsx
var Command$2 = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(Command$1, {
	ref,
	className: cn("flex h-full w-full flex-col overflow-hidden rounded-md bg-popover text-popover-foreground", className),
	...props
}));
Command$2.displayName = Command$1.displayName;
var CommandDialog = ({ children, ...props }) => {
	return /* @__PURE__ */ jsx(Dialog, {
		...props,
		children: /* @__PURE__ */ jsx(DialogContent, {
			className: "overflow-hidden p-0",
			children: /* @__PURE__ */ jsx(Command$2, {
				className: "[&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:text-muted-foreground [&_[cmdk-group]:not([hidden])_~[cmdk-group]]:pt-0 [&_[cmdk-group]]:px-2 [&_[cmdk-input-wrapper]_svg]:h-5 [&_[cmdk-input-wrapper]_svg]:w-5 [&_[cmdk-input]]:h-12 [&_[cmdk-item]]:px-2 [&_[cmdk-item]]:py-3 [&_[cmdk-item]_svg]:h-5 [&_[cmdk-item]_svg]:w-5",
				children
			})
		})
	});
};
var CommandInput = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxs("div", {
	className: "flex items-center border-b px-3",
	"cmdk-input-wrapper": "",
	children: [/* @__PURE__ */ jsx(Search, { className: "mr-2 h-4 w-4 shrink-0 opacity-50" }), /* @__PURE__ */ jsx(Command$1.Input, {
		ref,
		className: cn("flex h-10 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50", className),
		...props
	})]
}));
CommandInput.displayName = Command$1.Input.displayName;
var CommandList = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(Command$1.List, {
	ref,
	className: cn("max-h-[300px] overflow-y-auto overflow-x-hidden", className),
	...props
}));
CommandList.displayName = Command$1.List.displayName;
var CommandEmpty = React.forwardRef((props, ref) => /* @__PURE__ */ jsx(Command$1.Empty, {
	ref,
	className: "py-6 text-center text-sm",
	...props
}));
CommandEmpty.displayName = Command$1.Empty.displayName;
var CommandGroup = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(Command$1.Group, {
	ref,
	className: cn("overflow-hidden p-1 text-foreground [&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-1.5 [&_[cmdk-group-heading]]:text-xs [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:text-muted-foreground", className),
	...props
}));
CommandGroup.displayName = Command$1.Group.displayName;
var CommandSeparator = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(Command$1.Separator, {
	ref,
	className: cn("-mx-1 h-px bg-border", className),
	...props
}));
CommandSeparator.displayName = Command$1.Separator.displayName;
var CommandItem = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(Command$1.Item, {
	ref,
	className: cn("relative flex cursor-default gap-2 select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none data-[disabled=true]:pointer-events-none data-[selected=true]:bg-accent data-[selected=true]:text-accent-foreground data-[disabled=true]:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0", className),
	...props
}));
CommandItem.displayName = Command$1.Item.displayName;
var CommandShortcut = ({ className, ...props }) => {
	return /* @__PURE__ */ jsx("span", {
		className: cn("ml-auto text-xs tracking-widest text-muted-foreground", className),
		...props
	});
};
CommandShortcut.displayName = "CommandShortcut";
//#endregion
//#region src/components/command-palette.tsx
function CommandPalette({ onCreate }) {
	const [open, setOpen] = useState(false);
	const [search, setSearch] = useState("");
	const navigate = useNavigate();
	const customers = active(useErp((s) => s.customers));
	const suppliers = active(useErp((s) => s.suppliers));
	const vehicles = active(useErp((s) => s.vehicles));
	const drivers = active(useErp((s) => s.drivers));
	const products = active(useErp((s) => s.products));
	const orders = active(useErp((s) => s.orders));
	const deals = active(useErp((s) => s.deals));
	const salesInvoices = active(useErp((s) => s.salesInvoices));
	const purchaseInvoices = active(useErp((s) => s.purchaseInvoices));
	const trips = active(useErp((s) => s.trips));
	useEffect(() => {
		function handler(e) {
			if ((e.key === "k" || e.key === "K") && (e.metaKey || e.ctrlKey)) {
				e.preventDefault();
				setOpen((o) => !o);
			}
		}
		document.addEventListener("keydown", handler);
		return () => document.removeEventListener("keydown", handler);
	}, []);
	function go(to) {
		setOpen(false);
		setSearch("");
		navigate({ to });
	}
	const filtered = useMemo(() => {
		if (!search) return {
			customers: [],
			suppliers: [],
			vehicles: [],
			drivers: [],
			products: [],
			orders: [],
			deals: [],
			salesInvoices: [],
			purchaseInvoices: [],
			trips: []
		};
		const s = search.toLowerCase();
		return {
			customers: customers.filter((c) => c.name.toLowerCase().includes(s) || c.mobile && c.mobile.includes(s)).slice(0, 5),
			suppliers: suppliers.filter((v) => v.name.toLowerCase().includes(s) || v.mobile && v.mobile.includes(s)).slice(0, 5),
			vehicles: vehicles.filter((v) => v.number.toLowerCase().includes(s)).slice(0, 5),
			drivers: drivers.filter((d) => d.name.toLowerCase().includes(s) || d.licenseNumber && d.licenseNumber.toLowerCase().includes(s)).slice(0, 5),
			products: products.filter((p) => p.name.toLowerCase().includes(s) || p.code.toLowerCase().includes(s)).slice(0, 5),
			orders: orders.filter((o) => o.no.toLowerCase().includes(s) || o.customer.toLowerCase().includes(s)).slice(0, 5),
			deals: deals.filter((d) => d.dealNo.toLowerCase().includes(s) || (d.customer || "").toLowerCase().includes(s)).slice(0, 5),
			salesInvoices: salesInvoices.filter((i) => i.no.toLowerCase().includes(s) || i.party.toLowerCase().includes(s)).slice(0, 5),
			purchaseInvoices: purchaseInvoices.filter((i) => i.no.toLowerCase().includes(s) || i.party.toLowerCase().includes(s)).slice(0, 5),
			trips: trips.filter((t) => t.tripNo.toLowerCase().includes(s) || t.vehicle.toLowerCase().includes(s)).slice(0, 5)
		};
	}, [
		search,
		customers,
		suppliers,
		vehicles,
		drivers,
		products,
		orders,
		deals,
		salesInvoices,
		purchaseInvoices,
		trips
	]);
	Object.values(filtered).some((arr) => arr.length > 0);
	return /* @__PURE__ */ jsxs(CommandDialog, {
		open,
		onOpenChange: setOpen,
		children: [/* @__PURE__ */ jsx(CommandInput, {
			placeholder: "Search anything — customers, orders, vehicles, deals, invoices…",
			value: search,
			onValueChange: setSearch
		}), /* @__PURE__ */ jsxs(CommandList, { children: [
			/* @__PURE__ */ jsx(CommandEmpty, { children: "No matches found." }),
			!search && /* @__PURE__ */ jsxs(Fragment, { children: [
				/* @__PURE__ */ jsx(CommandGroup, {
					heading: "Quick actions",
					children: /* @__PURE__ */ jsxs(CommandItem, {
						onSelect: () => {
							setOpen(false);
							setSearch("");
							onCreate();
						},
						children: [/* @__PURE__ */ jsx(Sparkles, { className: "mr-2 h-4 w-4 text-primary" }), "Create One-Shot Order"]
					})
				}),
				/* @__PURE__ */ jsx(CommandSeparator, {}),
				/* @__PURE__ */ jsxs(CommandGroup, {
					heading: "Navigate",
					children: [
						/* @__PURE__ */ jsxs(CommandItem, {
							onSelect: () => go("/"),
							children: [/* @__PURE__ */ jsx(LayoutDashboard, { className: "mr-2 h-4 w-4" }), "Dashboard"]
						}),
						/* @__PURE__ */ jsxs(CommandItem, {
							onSelect: () => go("/deals"),
							children: [/* @__PURE__ */ jsx(Layers, { className: "mr-2 h-4 w-4" }), "Deals Tracker"]
						}),
						/* @__PURE__ */ jsxs(CommandItem, {
							onSelect: () => go("/operations"),
							children: [/* @__PURE__ */ jsx(Layers, { className: "mr-2 h-4 w-4" }), "Operations Register"]
						}),
						/* @__PURE__ */ jsxs(CommandItem, {
							onSelect: () => go("/saleinvoice"),
							children: [/* @__PURE__ */ jsx(Receipt, { className: "mr-2 h-4 w-4" }), "Sales Invoices"]
						}),
						/* @__PURE__ */ jsxs(CommandItem, {
							onSelect: () => go("/purchaseinvoice"),
							children: [/* @__PURE__ */ jsx(Receipt, { className: "mr-2 h-4 w-4" }), "Purchase Invoices"]
						}),
						/* @__PURE__ */ jsxs(CommandItem, {
							onSelect: () => go("/ledger"),
							children: [/* @__PURE__ */ jsx(Wallet, { className: "mr-2 h-4 w-4" }), "Ledger 360°"]
						}),
						/* @__PURE__ */ jsxs(CommandItem, {
							onSelect: () => go("/reports"),
							children: [/* @__PURE__ */ jsx(BarChart3, { className: "mr-2 h-4 w-4" }), "Reports"]
						})
					]
				}),
				/* @__PURE__ */ jsx(CommandSeparator, {}),
				/* @__PURE__ */ jsxs(CommandGroup, {
					heading: "Masters",
					children: [
						/* @__PURE__ */ jsxs(CommandItem, {
							onSelect: () => go("/customers"),
							children: [/* @__PURE__ */ jsx(Users, { className: "mr-2 h-4 w-4" }), "Customers"]
						}),
						/* @__PURE__ */ jsxs(CommandItem, {
							onSelect: () => go("/suppliers"),
							children: [/* @__PURE__ */ jsx(Factory, { className: "mr-2 h-4 w-4" }), "Suppliers"]
						}),
						/* @__PURE__ */ jsxs(CommandItem, {
							onSelect: () => go("/products"),
							children: [/* @__PURE__ */ jsx(Package, { className: "mr-2 h-4 w-4" }), "Products"]
						}),
						/* @__PURE__ */ jsxs(CommandItem, {
							onSelect: () => go("/vehicles"),
							children: [/* @__PURE__ */ jsx(Bus, { className: "mr-2 h-4 w-4" }), "Vehicles"]
						}),
						/* @__PURE__ */ jsxs(CommandItem, {
							onSelect: () => go("/drivers"),
							children: [/* @__PURE__ */ jsx(IdCard, { className: "mr-2 h-4 w-4" }), "Drivers"]
						}),
						/* @__PURE__ */ jsxs(CommandItem, {
							onSelect: () => go("/expensesheads"),
							children: [/* @__PURE__ */ jsx(Settings, { className: "mr-2 h-4 w-4" }), "Expense Heads"]
						})
					]
				})
			] }),
			search && /* @__PURE__ */ jsxs(Fragment, { children: [
				filtered.customers.length > 0 && /* @__PURE__ */ jsx(CommandGroup, {
					heading: "Customers",
					children: filtered.customers.map((c) => /* @__PURE__ */ jsxs(CommandItem, {
						onSelect: () => go(`/customers?id=${c.id}`),
						children: [/* @__PURE__ */ jsx(Users, { className: "mr-2 h-4 w-4 text-muted-foreground" }), /* @__PURE__ */ jsxs("span", { children: [
							c.name,
							" (",
							c.mobile,
							")"
						] })]
					}, c.id))
				}),
				filtered.suppliers.length > 0 && /* @__PURE__ */ jsx(CommandGroup, {
					heading: "Suppliers",
					children: filtered.suppliers.map((s) => /* @__PURE__ */ jsxs(CommandItem, {
						onSelect: () => go(`/suppliers?id=${s.id}`),
						children: [/* @__PURE__ */ jsx(Factory, { className: "mr-2 h-4 w-4 text-muted-foreground" }), /* @__PURE__ */ jsxs("span", { children: [
							s.name,
							" (",
							s.mobile,
							")"
						] })]
					}, s.id))
				}),
				filtered.deals.length > 0 && /* @__PURE__ */ jsx(CommandGroup, {
					heading: "Deals",
					children: filtered.deals.map((d) => /* @__PURE__ */ jsxs(CommandItem, {
						onSelect: () => go("/deals"),
						children: [/* @__PURE__ */ jsx(Layers, { className: "mr-2 h-4 w-4 text-primary" }), /* @__PURE__ */ jsxs("span", { children: [
							"Deal ",
							d.dealNo,
							" — ",
							d.customer
						] })]
					}, d.id))
				}),
				filtered.orders.length > 0 && /* @__PURE__ */ jsx(CommandGroup, {
					heading: "Orders",
					children: filtered.orders.map((o) => /* @__PURE__ */ jsxs(CommandItem, {
						onSelect: () => go("/orders"),
						children: [/* @__PURE__ */ jsx(ShoppingCart, { className: "mr-2 h-4 w-4 text-muted-foreground" }), /* @__PURE__ */ jsxs("span", { children: [
							"Order ",
							o.no,
							" — ",
							o.customer,
							" (",
							o.product,
							")"
						] })]
					}, o.id))
				}),
				filtered.salesInvoices.length > 0 && /* @__PURE__ */ jsx(CommandGroup, {
					heading: "Sales Invoices",
					children: filtered.salesInvoices.map((i) => /* @__PURE__ */ jsxs(CommandItem, {
						onSelect: () => go("/saleinvoice"),
						children: [/* @__PURE__ */ jsx(Receipt, { className: "mr-2 h-4 w-4 text-muted-foreground" }), /* @__PURE__ */ jsxs("span", { children: [
							"Invoice ",
							i.no,
							" — ",
							i.party,
							" (",
							inr(i.amount),
							")"
						] })]
					}, i.id))
				}),
				filtered.purchaseInvoices.length > 0 && /* @__PURE__ */ jsx(CommandGroup, {
					heading: "Purchase Bills",
					children: filtered.purchaseInvoices.map((i) => /* @__PURE__ */ jsxs(CommandItem, {
						onSelect: () => go("/purchaseinvoice"),
						children: [/* @__PURE__ */ jsx(Receipt, { className: "mr-2 h-4 w-4 text-muted-foreground" }), /* @__PURE__ */ jsxs("span", { children: [
							"Bill ",
							i.no,
							" — ",
							i.party,
							" (",
							inr(i.amount),
							")"
						] })]
					}, i.id))
				}),
				filtered.trips.length > 0 && /* @__PURE__ */ jsx(CommandGroup, {
					heading: "Trips",
					children: filtered.trips.map((t) => /* @__PURE__ */ jsxs(CommandItem, {
						onSelect: () => go("/trips"),
						children: [/* @__PURE__ */ jsx(Route, { className: "mr-2 h-4 w-4 text-muted-foreground" }), /* @__PURE__ */ jsxs("span", { children: [
							"Trip ",
							t.tripNo,
							" — ",
							t.vehicle,
							" (",
							t.driver,
							")"
						] })]
					}, t.id))
				}),
				filtered.vehicles.length > 0 && /* @__PURE__ */ jsx(CommandGroup, {
					heading: "Vehicles",
					children: filtered.vehicles.map((v) => /* @__PURE__ */ jsxs(CommandItem, {
						onSelect: () => go(`/vehicles?id=${v.id}`),
						children: [/* @__PURE__ */ jsx(Bus, { className: "mr-2 h-4 w-4 text-muted-foreground" }), /* @__PURE__ */ jsxs("span", { children: [
							v.number,
							" — ",
							v.vehicleType
						] })]
					}, v.id))
				}),
				filtered.drivers.length > 0 && /* @__PURE__ */ jsx(CommandGroup, {
					heading: "Drivers",
					children: filtered.drivers.map((d) => /* @__PURE__ */ jsxs(CommandItem, {
						onSelect: () => go(`/drivers?id=${d.id}`),
						children: [/* @__PURE__ */ jsx(IdCard, { className: "mr-2 h-4 w-4 text-muted-foreground" }), /* @__PURE__ */ jsxs("span", { children: [
							d.name,
							" — Lic: ",
							d.licenseNumber
						] })]
					}, d.id))
				}),
				filtered.products.length > 0 && /* @__PURE__ */ jsx(CommandGroup, {
					heading: "Products",
					children: filtered.products.map((p) => /* @__PURE__ */ jsxs(CommandItem, {
						onSelect: () => go("/products"),
						children: [/* @__PURE__ */ jsx(Package, { className: "mr-2 h-4 w-4 text-muted-foreground" }), /* @__PURE__ */ jsxs("span", { children: [
							p.name,
							" (",
							p.code,
							")"
						] })]
					}, p.id))
				})
			] })
		] })]
	});
}
//#endregion
//#region src/routes/__root.tsx
function ErrorComponent({ error, reset }) {
	console.error(error);
	const router = useRouter();
	useEffect(() => {
		reportLovableError(error, { boundary: "tanstack_root_error_component" });
	}, [error]);
	return /* @__PURE__ */ jsx("div", {
		className: "flex min-h-screen items-center justify-center bg-background px-4",
		children: /* @__PURE__ */ jsxs("div", {
			className: "max-w-md text-center",
			children: [
				/* @__PURE__ */ jsx("h1", {
					className: "font-display text-xl font-semibold text-foreground",
					children: "Something went wrong"
				}),
				/* @__PURE__ */ jsx("p", {
					className: "mt-2 text-sm text-muted-foreground",
					children: error.message || "Please try again."
				}),
				/* @__PURE__ */ jsx("div", {
					className: "mt-6 flex justify-center gap-2",
					children: /* @__PURE__ */ jsx(Button, {
						onClick: () => {
							router.invalidate();
							reset();
						},
						children: "Try again"
					})
				})
			]
		})
	});
}
function NotFoundComponent() {
	return /* @__PURE__ */ jsxs("div", {
		className: "flex min-h-[60vh] flex-col items-center justify-center px-4 text-center",
		children: [/* @__PURE__ */ jsx("p", {
			className: "font-display text-6xl font-semibold text-primary",
			children: "404"
		}), /* @__PURE__ */ jsx("p", {
			className: "mt-2 text-sm text-muted-foreground",
			children: "This module is not on the route map."
		})]
	});
}
var Route$29 = createRootRouteWithContext()({
	head: () => ({
		meta: [
			{ charSet: "utf-8" },
			{
				name: "viewport",
				content: "width=device-width, initial-scale=1"
			},
			{ title: "Honey Enterprises ERP" },
			{
				name: "description",
				content: "Stone crusher, aggregate trading and transport ERP for Honey Enterprises."
			},
			{
				name: "theme-color",
				content: "#0f172a"
			},
			{
				name: "apple-mobile-web-app-capable",
				content: "yes"
			},
			{
				name: "apple-mobile-web-app-status-bar-style",
				content: "black-translucent"
			},
			{
				name: "apple-mobile-web-app-title",
				content: "Honey ERP"
			},
			{
				name: "mobile-web-app-capable",
				content: "yes"
			},
			{
				property: "og:title",
				content: "Honey Enterprises ERP"
			},
			{
				name: "twitter:title",
				content: "Honey Enterprises ERP"
			},
			{
				property: "og:description",
				content: "Stone crusher, aggregate trading and transport ERP for Honey Enterprises."
			},
			{
				name: "twitter:description",
				content: "Stone crusher, aggregate trading and transport ERP for Honey Enterprises."
			},
			{
				property: "og:image",
				content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/3948ac91-0ca4-4ca1-9b03-9a00f1f7101b/id-preview-ec519bab--ba14a1a2-2524-45d2-be8c-aaeaeb3d1806.lovable.app-1780409184473.png"
			},
			{
				name: "twitter:image",
				content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/3948ac91-0ca4-4ca1-9b03-9a00f1f7101b/id-preview-ec519bab--ba14a1a2-2524-45d2-be8c-aaeaeb3d1806.lovable.app-1780409184473.png"
			},
			{
				name: "twitter:card",
				content: "summary_large_image"
			},
			{
				property: "og:type",
				content: "website"
			}
		],
		links: [
			{
				rel: "stylesheet",
				href: styles_default
			},
			{
				rel: "manifest",
				href: "/manifest.webmanifest"
			},
			{
				rel: "icon",
				href: "/icon-192.png",
				type: "image/png",
				sizes: "192x192"
			},
			{
				rel: "icon",
				href: "/icon-512.png",
				type: "image/png",
				sizes: "512x512"
			},
			{
				rel: "apple-touch-icon",
				href: "/icon-192.png"
			},
			{
				rel: "preconnect",
				href: "https://fonts.googleapis.com"
			},
			{
				rel: "preconnect",
				href: "https://fonts.gstatic.com",
				crossOrigin: "anonymous"
			},
			{
				rel: "stylesheet",
				href: "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Space+Grotesk:wght@500;600;700&family=JetBrains+Mono:wght@400;500&display=swap"
			}
		]
	}),
	shellComponent: RootShell,
	component: RootComponent,
	notFoundComponent: NotFoundComponent,
	errorComponent: ErrorComponent
});
function RootShell({ children }) {
	const { theme } = useTheme();
	return /* @__PURE__ */ jsxs("html", {
		lang: "en",
		className: theme === "dark" ? "dark" : "",
		children: [/* @__PURE__ */ jsx("head", { children: /* @__PURE__ */ jsx(HeadContent, {}) }), /* @__PURE__ */ jsxs("body", { children: [children, /* @__PURE__ */ jsx(Scripts, {})] })]
	});
}
var sevIcon = {
	critical: ShieldAlert,
	warning: AlertTriangle,
	info: Info
};
var sevClass = {
	critical: "bg-destructive/15 text-destructive border-destructive/30",
	warning: "bg-warning/15 text-warning border-warning/30",
	info: "bg-info/15 text-info border-info/30"
};
function RootComponent() {
	const { queryClient } = Route$29.useRouteContext();
	const navigate = useNavigate();
	const router = useRouter();
	const [oneShot, setOneShot] = useState(false);
	const { theme, toggleTheme, setTheme } = useTheme();
	const [user, setUser] = useState(null);
	const alerts = useAlerts();
	const isLoginPage = router.state.location.pathname === "/login";
	useEffect(() => {
		const token = localStorage.getItem("auth_token");
		const userData = localStorage.getItem("user");
		if (!token && !isLoginPage) {
			navigate({ to: "/login" });
			return;
		}
		if (userData) try {
			setUser(JSON.parse(userData));
		} catch (e) {
			console.error("Failed to parse user data");
		}
	}, [navigate, isLoginPage]);
	useEffect(() => {
		const handleKeyDown = (e) => {
			if ((e.ctrlKey || e.metaKey) && e.key === "p") {
				e.preventDefault();
				window.print();
			}
			if ((e.ctrlKey || e.metaKey) && e.key === "f") {
				e.preventDefault();
				document.dispatchEvent(new KeyboardEvent("keydown", {
					key: "k",
					metaKey: true
				}));
			}
		};
		window.addEventListener("keydown", handleKeyDown);
		return () => window.removeEventListener("keydown", handleKeyDown);
	}, []);
	useEffect(() => {
		loadBackendData().catch((error) => {
			console.warn("Unable to load backend ERP data:", error);
		});
	}, []);
	useEffect(() => {
		setTheme(theme);
	}, []);
	const handleLogout = async () => {
		try {
			await logout();
		} catch (error) {
			console.error("Logout error:", error);
		}
		localStorage.removeItem("auth_token");
		localStorage.removeItem("user");
		navigate({ to: "/login" });
	};
	if (isLoginPage) return /* @__PURE__ */ jsxs(QueryClientProvider, {
		client: queryClient,
		children: [/* @__PURE__ */ jsx("div", {
			className: "min-h-screen w-full",
			children: /* @__PURE__ */ jsx(Outlet, {})
		}), /* @__PURE__ */ jsx(Toaster$1, {
			richColors: true,
			position: "top-right"
		})]
	});
	return /* @__PURE__ */ jsx(QueryClientProvider, {
		client: queryClient,
		children: /* @__PURE__ */ jsxs(SidebarProvider, { children: [
			/* @__PURE__ */ jsxs("div", {
				className: "flex min-h-screen w-full bg-background",
				children: [/* @__PURE__ */ jsx(AppSidebar, {}), /* @__PURE__ */ jsxs("div", {
					className: "flex min-w-0 flex-1 flex-col",
					children: [/* @__PURE__ */ jsxs("header", {
						className: "sticky top-0 z-30 flex h-14 items-center gap-3 border-b border-border bg-background/80 px-4 backdrop-blur",
						children: [
							/* @__PURE__ */ jsx(SidebarTrigger, {}),
							/* @__PURE__ */ jsxs("button", {
								onClick: () => document.dispatchEvent(new KeyboardEvent("keydown", {
									key: "k",
									metaKey: true
								})),
								className: "hidden h-9 max-w-md flex-1 items-center gap-2 rounded-md border border-border bg-card px-3 text-left text-xs text-muted-foreground transition hover:border-primary/50 md:flex",
								children: [
									/* @__PURE__ */ jsx(Command, { className: "h-3.5 w-3.5" }),
									/* @__PURE__ */ jsx("span", { children: "Quick search & jump…" }),
									/* @__PURE__ */ jsx("kbd", {
										className: "ml-auto rounded bg-muted px-1.5 py-0.5 font-mono text-[10px]",
										children: "⌘K"
									})
								]
							}),
							/* @__PURE__ */ jsxs("div", {
								className: "ml-auto flex items-center gap-2",
								children: [
									/* @__PURE__ */ jsxs(Button, {
										variant: "outline",
										size: "sm",
										className: "hidden sm:inline-flex",
										onClick: () => setOneShot(true),
										children: [/* @__PURE__ */ jsx(Sparkles, { className: "mr-1 h-3.5 w-3.5" }), "One-Shot"]
									}),
									/* @__PURE__ */ jsxs(Popover, { children: [/* @__PURE__ */ jsx(PopoverTrigger, {
										asChild: true,
										children: /* @__PURE__ */ jsxs(Button, {
											variant: "ghost",
											size: "icon",
											"aria-label": "Notifications",
											className: "relative",
											children: [/* @__PURE__ */ jsx(Bell, { className: "h-4 w-4" }), alerts.length > 0 && /* @__PURE__ */ jsx("span", {
												className: "absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-destructive text-[8px] font-bold text-destructive-foreground",
												children: alerts.length
											})]
										})
									}), /* @__PURE__ */ jsxs(PopoverContent, {
										className: "w-80 p-0",
										align: "end",
										children: [/* @__PURE__ */ jsxs("div", {
											className: "flex items-center justify-between border-b border-border px-4 py-2.5",
											children: [/* @__PURE__ */ jsx("h3", {
												className: "font-display text-sm font-semibold",
												children: "Smart alerts"
											}), /* @__PURE__ */ jsx(Badge, {
												variant: "outline",
												className: "text-[10px]",
												children: alerts.length
											})]
										}), /* @__PURE__ */ jsx("ul", {
											className: "max-h-80 divide-y divide-border overflow-y-auto",
											children: alerts.length === 0 ? /* @__PURE__ */ jsx("li", {
												className: "px-4 py-6 text-center text-xs text-muted-foreground",
												children: "All clear — nothing needs attention."
											}) : alerts.map((a) => {
												const Icon = sevIcon[a.severity] || Info;
												const inner = /* @__PURE__ */ jsxs("div", {
													className: "flex items-start gap-3 px-4 py-2.5 transition hover:bg-muted/30",
													children: [/* @__PURE__ */ jsx("span", {
														className: `mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-md border ${sevClass[a.severity]}`,
														children: /* @__PURE__ */ jsx(Icon, { className: "h-3.5 w-3.5" })
													}), /* @__PURE__ */ jsxs("div", {
														className: "min-w-0 flex-1",
														children: [/* @__PURE__ */ jsx("p", {
															className: "truncate text-xs font-medium text-foreground",
															children: a.title
														}), /* @__PURE__ */ jsxs("p", {
															className: "text-[10px] text-muted-foreground",
															children: [
																a.category,
																" • ",
																a.detail
															]
														})]
													})]
												});
												return /* @__PURE__ */ jsx("li", { children: a.href ? /* @__PURE__ */ jsx(Link, {
													to: a.href,
													className: "block",
													children: inner
												}) : inner }, a.id);
											})
										})]
									})] }),
									/* @__PURE__ */ jsx(Button, {
										variant: "ghost",
										size: "icon",
										"aria-label": "Toggle theme",
										onClick: toggleTheme,
										title: `Switch to ${theme === "dark" ? "light" : "dark"} theme`,
										children: theme === "dark" ? /* @__PURE__ */ jsx(Sun, { className: "h-4 w-4" }) : /* @__PURE__ */ jsx(Moon, { className: "h-4 w-4" })
									}),
									/* @__PURE__ */ jsx(Button, {
										variant: "ghost",
										size: "icon",
										"aria-label": "Logout",
										onClick: handleLogout,
										title: "Logout",
										className: "text-muted-foreground hover:text-foreground",
										children: /* @__PURE__ */ jsx(LogOut, { className: "h-4 w-4" })
									}),
									/* @__PURE__ */ jsxs("div", {
										className: "flex items-center gap-2 rounded-md border border-border bg-card px-2.5 py-1.5",
										children: [/* @__PURE__ */ jsx("div", {
											className: "flex h-7 w-7 items-center justify-center rounded-full bg-primary text-xs font-semibold text-primary-foreground",
											children: user?.username?.[0]?.toUpperCase() || "A"
										}), /* @__PURE__ */ jsxs("div", {
											className: "hidden text-left leading-tight sm:block",
											children: [/* @__PURE__ */ jsx("p", {
												className: "text-xs font-medium text-foreground",
												children: user?.username || "Admin"
											}), /* @__PURE__ */ jsx("p", {
												className: "text-[10px] text-muted-foreground",
												children: user?.role || "Administrator"
											})]
										})]
									})
								]
							})
						]
					}), /* @__PURE__ */ jsx("main", {
						className: "flex-1",
						children: /* @__PURE__ */ jsx(Outlet, {})
					})]
				})]
			}),
			/* @__PURE__ */ jsx(CommandPalette, { onCreate: () => setOneShot(true) }),
			/* @__PURE__ */ jsx(OneShotOrderDialog, {
				open: oneShot,
				onOpenChange: setOneShot
			}),
			/* @__PURE__ */ jsx(Toaster$1, {
				richColors: true,
				position: "top-right"
			})
		] })
	});
}
//#endregion
//#region src/routes/weighbridge.tsx
var $$splitComponentImporter$27 = () => import("./weighbridge-CCNX6pyD.js");
var Route$28 = createFileRoute("/weighbridge")({
	head: () => ({ meta: [{ title: "Weighbridge — Honey Enterprises ERP" }] }),
	component: lazyRouteComponent($$splitComponentImporter$27, "component")
});
//#endregion
//#region src/routes/vehicles.tsx
var $$splitComponentImporter$26 = () => import("./vehicles-DmKe_kOz.js");
var Route$27 = createFileRoute("/vehicles")({
	head: () => ({ meta: [{ title: "Vehicles — Honey Enterprises ERP" }] }),
	component: lazyRouteComponent($$splitComponentImporter$26, "component")
});
//#endregion
//#region src/routes/trips.tsx
var $$splitComponentImporter$25 = () => import("./trips-Dmh4vIdJ.js");
var Route$26 = createFileRoute("/trips")({
	head: () => ({ meta: [{ title: "Trips — Honey Enterprises ERP" }] }),
	component: lazyRouteComponent($$splitComponentImporter$25, "component")
});
//#endregion
//#region src/routes/suppliers.tsx
var $$splitComponentImporter$24 = () => import("./suppliers-B_Z2eUpi.js");
var Route$25 = createFileRoute("/suppliers")({
	head: () => ({ meta: [{ title: "Suppliers — Honey Enterprises ERP" }] }),
	component: lazyRouteComponent($$splitComponentImporter$24, "component")
});
//#endregion
//#region src/routes/settings.tsx
var $$splitComponentImporter$23 = () => import("./settings-DMfIUaGh.js");
var Route$24 = createFileRoute("/settings")({
	head: () => ({ meta: [{ title: "Settings — Honey Enterprises ERP" }] }),
	component: lazyRouteComponent($$splitComponentImporter$23, "component")
});
//#endregion
//#region src/routes/saleinvoice.tsx
var $$splitComponentImporter$22 = () => import("./saleinvoice-DRRD-fZv.js");
var Route$23 = createFileRoute("/saleinvoice")({
	head: () => ({ meta: [{ title: "Sales Invoices — Honey Enterprises ERP" }] }),
	component: lazyRouteComponent($$splitComponentImporter$22, "component")
});
//#endregion
//#region src/routes/reports.tsx
var $$splitComponentImporter$21 = () => import("./reports-CGMlchBr.js");
var Route$22 = createFileRoute("/reports")({
	head: () => ({ meta: [{ title: "Reports — Honey Enterprises ERP" }] }),
	component: lazyRouteComponent($$splitComponentImporter$21, "component")
});
//#endregion
//#region src/routes/purchaseinvoice.tsx
var $$splitComponentImporter$20 = () => import("./purchaseinvoice-BeZZ8ZK5.js");
var Route$21 = createFileRoute("/purchaseinvoice")({
	head: () => ({ meta: [{ title: "Purchase Invoices — Honey Enterprises ERP" }] }),
	component: lazyRouteComponent($$splitComponentImporter$20, "component")
});
//#endregion
//#region src/routes/products.tsx
var $$splitComponentImporter$19 = () => import("./products-DgYHqCub.js");
var Route$20 = createFileRoute("/products")({
	head: () => ({ meta: [{ title: "Products — Honey Enterprises ERP" }] }),
	component: lazyRouteComponent($$splitComponentImporter$19, "component")
});
//#endregion
//#region src/routes/orders.tsx
var $$splitComponentImporter$18 = () => import("./orders-BscXDN9V.js");
var Route$19 = createFileRoute("/orders")({
	head: () => ({ meta: [{ title: "Orders — Honey Enterprises ERP" }] }),
	component: lazyRouteComponent($$splitComponentImporter$18, "component")
});
//#endregion
//#region src/routes/operations.tsx
var $$splitComponentImporter$17 = () => import("./operations-CJSLdKmy.js");
var Route$18 = createFileRoute("/operations")({
	head: () => ({ meta: [{ title: "Operations — Honey Enterprises ERP" }] }),
	component: lazyRouteComponent($$splitComponentImporter$17, "component")
});
//#endregion
//#region src/routes/login.tsx
var $$splitComponentImporter$16 = () => import("./login-CB05e7Zw.js");
var Route$17 = createFileRoute("/login")({
	head: () => ({ meta: [{ title: "Login — Honey Enterprises ERP" }] }),
	component: lazyRouteComponent($$splitComponentImporter$16, "component")
});
//#endregion
//#region src/routes/ledger.tsx
var $$splitComponentImporter$15 = () => import("./ledger-CDAn8sbZ.js");
var Route$16 = createFileRoute("/ledger")({
	head: () => ({ meta: [{ title: "Ledger 360° — Honey Enterprises ERP" }] }),
	component: lazyRouteComponent($$splitComponentImporter$15, "component")
});
//#endregion
//#region src/routes/hsn.tsx
var $$splitComponentImporter$14 = () => import("./hsn-BM0BXq-8.js");
var Route$15 = createFileRoute("/hsn")({
	head: () => ({ meta: [{ title: "HSN Codes — Honey Enterprises ERP" }] }),
	component: lazyRouteComponent($$splitComponentImporter$14, "component")
});
//#endregion
//#region src/routes/expensesheads.tsx
var $$splitComponentImporter$13 = () => import("./expensesheads-C4WRUs-E.js");
var Route$14 = createFileRoute("/expensesheads")({
	head: () => ({ meta: [{ title: "Expense Heads — Honey Enterprises ERP" }] }),
	component: lazyRouteComponent($$splitComponentImporter$13, "component")
});
//#endregion
//#region src/routes/expenses.tsx
var $$splitComponentImporter$12 = () => import("./expenses-Odvh-mw6.js");
var Route$13 = createFileRoute("/expenses")({
	head: () => ({ meta: [{ title: "Expenses — Honey Enterprises ERP" }] }),
	component: lazyRouteComponent($$splitComponentImporter$12, "component")
});
//#endregion
//#region src/routes/executive.tsx
var $$splitComponentImporter$11 = () => import("./executive-BcVvO2No.js");
var Route$12 = createFileRoute("/executive")({
	head: () => ({ meta: [{ title: "Executive Dashboard — Honey Enterprises ERP" }] }),
	component: lazyRouteComponent($$splitComponentImporter$11, "component")
});
//#endregion
//#region src/routes/drivers.tsx
var $$splitComponentImporter$10 = () => import("./drivers-2nRDUHym.js");
var Route$11 = createFileRoute("/drivers")({
	head: () => ({ meta: [{ title: "Drivers — Honey Enterprises ERP" }] }),
	component: lazyRouteComponent($$splitComponentImporter$10, "component")
});
//#endregion
//#region src/routes/dispatch.tsx
var $$splitComponentImporter$9 = () => import("./dispatch-C2Nq8OkY.js");
var Route$10 = createFileRoute("/dispatch")({
	head: () => ({ meta: [{ title: "Dispatch — Honey Enterprises ERP" }] }),
	component: lazyRouteComponent($$splitComponentImporter$9, "component")
});
//#endregion
//#region src/routes/deals.tsx
var $$splitComponentImporter$8 = () => import("./deals-D6y3v_Cg.js");
var Route$9 = createFileRoute("/deals")({
	head: () => ({ meta: [{ title: "Deals — Honey Enterprises ERP" }] }),
	component: lazyRouteComponent($$splitComponentImporter$8, "component")
});
//#endregion
//#region src/routes/customers.tsx
var $$splitComponentImporter$7 = () => import("./customers-BPu8QdzZ.js");
var Route$8 = createFileRoute("/customers")({
	head: () => ({ meta: [{ title: "Customers — Honey Enterprises ERP" }] }),
	component: lazyRouteComponent($$splitComponentImporter$7, "component")
});
//#endregion
//#region src/routes/control-tower.tsx
var $$splitComponentImporter$6 = () => import("./control-tower-BQyPhH6H.js");
var Route$7 = createFileRoute("/control-tower")({
	head: () => ({ meta: [{ title: "Control Tower — Honey Enterprises ERP" }] }),
	component: lazyRouteComponent($$splitComponentImporter$6, "component")
});
//#endregion
//#region src/routes/cashbook.tsx
var $$splitComponentImporter$5 = () => import("./cashbook-zsjBEpHC.js");
var Route$6 = createFileRoute("/cashbook")({
	head: () => ({ meta: [{ title: "Cashbook — Honey Enterprises ERP" }] }),
	component: lazyRouteComponent($$splitComponentImporter$5, "component")
});
//#endregion
//#region src/routes/index.tsx
var $$splitComponentImporter$4 = () => import("./routes-BK1vEEXf.js");
var Route$5 = createFileRoute("/")({
	head: () => ({ meta: [{ title: "Dashboard — Honey Enterprises ERP" }, {
		name: "description",
		content: "Daily operations dashboard: orders, dispatch, trips, revenue and alerts."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$4, "component")
});
//#endregion
//#region src/routes/vehicles.$id.tsx
var $$splitComponentImporter$3 = () => import("./vehicles._id-DVeJMLFR.js");
var Route$4 = createFileRoute("/vehicles/$id")({
	head: () => ({ meta: [{ title: "Vehicle 360 — Honey Enterprises ERP" }] }),
	component: lazyRouteComponent($$splitComponentImporter$3, "component")
});
//#endregion
//#region src/routes/suppliers.$id.tsx
var $$splitComponentImporter$2 = () => import("./suppliers._id-CD-H9k4J.js");
var Route$3 = createFileRoute("/suppliers/$id")({
	head: () => ({ meta: [{ title: "Supplier 360 — Honey Enterprises ERP" }] }),
	component: lazyRouteComponent($$splitComponentImporter$2, "component")
});
//#endregion
//#region src/routes/drivers.$id.tsx
var $$splitComponentImporter$1 = () => import("./drivers._id-ikYoxqNx.js");
var Route$2 = createFileRoute("/drivers/$id")({
	head: () => ({ meta: [{ title: "Driver 360 — Honey Enterprises ERP" }] }),
	component: lazyRouteComponent($$splitComponentImporter$1, "component")
});
//#endregion
//#region src/routes/customers.$id.tsx
var $$splitNotFoundComponentImporter = () => import("./customers._id-BKn3wIvq.js");
var $$splitComponentImporter = () => import("./customers._id-B5jbEq-g.js");
var Route$1 = createFileRoute("/customers/$id")({
	head: () => ({ meta: [{ title: "Customer 360 — Honey Enterprises ERP" }] }),
	component: lazyRouteComponent($$splitComponentImporter, "component"),
	notFoundComponent: lazyRouteComponent($$splitNotFoundComponentImporter, "notFoundComponent")
});
//#endregion
//#region src/routeTree.gen.ts
var WeighbridgeRoute = Route$28.update({
	id: "/weighbridge",
	path: "/weighbridge",
	getParentRoute: () => Route$29
});
var VehiclesRoute = Route$27.update({
	id: "/vehicles",
	path: "/vehicles",
	getParentRoute: () => Route$29
});
var TripsRoute = Route$26.update({
	id: "/trips",
	path: "/trips",
	getParentRoute: () => Route$29
});
var SuppliersRoute = Route$25.update({
	id: "/suppliers",
	path: "/suppliers",
	getParentRoute: () => Route$29
});
var SettingsRoute = Route$24.update({
	id: "/settings",
	path: "/settings",
	getParentRoute: () => Route$29
});
var SaleinvoiceRoute = Route$23.update({
	id: "/saleinvoice",
	path: "/saleinvoice",
	getParentRoute: () => Route$29
});
var ReportsRoute = Route$22.update({
	id: "/reports",
	path: "/reports",
	getParentRoute: () => Route$29
});
var PurchaseinvoiceRoute = Route$21.update({
	id: "/purchaseinvoice",
	path: "/purchaseinvoice",
	getParentRoute: () => Route$29
});
var ProductsRoute = Route$20.update({
	id: "/products",
	path: "/products",
	getParentRoute: () => Route$29
});
var OrdersRoute = Route$19.update({
	id: "/orders",
	path: "/orders",
	getParentRoute: () => Route$29
});
var OperationsRoute = Route$18.update({
	id: "/operations",
	path: "/operations",
	getParentRoute: () => Route$29
});
var LoginRoute = Route$17.update({
	id: "/login",
	path: "/login",
	getParentRoute: () => Route$29
});
var LedgerRoute = Route$16.update({
	id: "/ledger",
	path: "/ledger",
	getParentRoute: () => Route$29
});
var HsnRoute = Route$15.update({
	id: "/hsn",
	path: "/hsn",
	getParentRoute: () => Route$29
});
var ExpensesheadsRoute = Route$14.update({
	id: "/expensesheads",
	path: "/expensesheads",
	getParentRoute: () => Route$29
});
var ExpensesRoute = Route$13.update({
	id: "/expenses",
	path: "/expenses",
	getParentRoute: () => Route$29
});
var ExecutiveRoute = Route$12.update({
	id: "/executive",
	path: "/executive",
	getParentRoute: () => Route$29
});
var DriversRoute = Route$11.update({
	id: "/drivers",
	path: "/drivers",
	getParentRoute: () => Route$29
});
var DispatchRoute = Route$10.update({
	id: "/dispatch",
	path: "/dispatch",
	getParentRoute: () => Route$29
});
var DealsRoute = Route$9.update({
	id: "/deals",
	path: "/deals",
	getParentRoute: () => Route$29
});
var CustomersRoute = Route$8.update({
	id: "/customers",
	path: "/customers",
	getParentRoute: () => Route$29
});
var ControlTowerRoute = Route$7.update({
	id: "/control-tower",
	path: "/control-tower",
	getParentRoute: () => Route$29
});
var CashbookRoute = Route$6.update({
	id: "/cashbook",
	path: "/cashbook",
	getParentRoute: () => Route$29
});
var IndexRoute = Route$5.update({
	id: "/",
	path: "/",
	getParentRoute: () => Route$29
});
var VehiclesIdRoute = Route$4.update({
	id: "/$id",
	path: "/$id",
	getParentRoute: () => VehiclesRoute
});
var SuppliersIdRoute = Route$3.update({
	id: "/$id",
	path: "/$id",
	getParentRoute: () => SuppliersRoute
});
var DriversIdRoute = Route$2.update({
	id: "/$id",
	path: "/$id",
	getParentRoute: () => DriversRoute
});
var CustomersRouteChildren = { CustomersIdRoute: Route$1.update({
	id: "/$id",
	path: "/$id",
	getParentRoute: () => CustomersRoute
}) };
var CustomersRouteWithChildren = CustomersRoute._addFileChildren(CustomersRouteChildren);
var DriversRouteChildren = { DriversIdRoute };
var DriversRouteWithChildren = DriversRoute._addFileChildren(DriversRouteChildren);
var SuppliersRouteChildren = { SuppliersIdRoute };
var SuppliersRouteWithChildren = SuppliersRoute._addFileChildren(SuppliersRouteChildren);
var VehiclesRouteChildren = { VehiclesIdRoute };
var rootRouteChildren = {
	IndexRoute,
	CashbookRoute,
	ControlTowerRoute,
	CustomersRoute: CustomersRouteWithChildren,
	DealsRoute,
	DispatchRoute,
	DriversRoute: DriversRouteWithChildren,
	ExecutiveRoute,
	ExpensesRoute,
	ExpensesheadsRoute,
	HsnRoute,
	LedgerRoute,
	LoginRoute,
	OperationsRoute,
	OrdersRoute,
	ProductsRoute,
	PurchaseinvoiceRoute,
	ReportsRoute,
	SaleinvoiceRoute,
	SettingsRoute,
	SuppliersRoute: SuppliersRouteWithChildren,
	TripsRoute,
	VehiclesRoute: VehiclesRoute._addFileChildren(VehiclesRouteChildren),
	WeighbridgeRoute
};
var routeTree = Route$29._addFileChildren(rootRouteChildren)._addFileTypes();
//#endregion
//#region src/router.tsx
var getRouter = () => {
	return createRouter({
		routeTree,
		context: { queryClient: new QueryClient() },
		scrollRestoration: true,
		defaultPreloadStaleTime: 0
	});
};
//#endregion
export { getRouter };
