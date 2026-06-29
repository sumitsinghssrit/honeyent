import { G as login } from "./clients-DsHCc4c7.js";
import { t as Button } from "./button-C1KSxKmF.js";
import { t as Input } from "./input-CCCvLIdb.js";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
import { Loader2, Lock, Mail, Zap } from "lucide-react";
import { toast } from "sonner";
import * as THREE from "three";
//#region src/components/3d-login-scene.tsx
function Scene3D({ containerRef }) {
	const [isMobile, setIsMobile] = useState(false);
	useEffect(() => {
		if (!containerRef.current) return;
		const width = containerRef.current.clientWidth;
		const isMobileScreen = width < 768;
		setIsMobile(isMobileScreen);
		const scene = new THREE.Scene();
		scene.background = new THREE.Color(988970);
		scene.fog = new THREE.Fog(988970, 80, 500);
		const camera = new THREE.PerspectiveCamera(isMobileScreen ? 60 : 75, width / containerRef.current.clientHeight, .1, 1e3);
		camera.position.set(0, 3, isMobileScreen ? 8 : 15);
		camera.lookAt(0, 1.5, 0);
		const renderer = new THREE.WebGLRenderer({
			antialias: !isMobileScreen,
			alpha: true,
			powerPreference: "low-power"
		});
		renderer.setSize(width, containerRef.current.clientHeight);
		const pixelRatio = isMobileScreen ? 1 : Math.min(window.devicePixelRatio, 2);
		renderer.setPixelRatio(pixelRatio);
		renderer.shadowMap.enabled = !isMobileScreen;
		if (renderer.shadowMap.enabled) renderer.shadowMap.type = THREE.PCFShadowShadowMap;
		containerRef.current.appendChild(renderer.domElement);
		const ambientLight = new THREE.AmbientLight(16777215, isMobileScreen ? .8 : .6);
		scene.add(ambientLight);
		if (!isMobileScreen) {
			const directionalLight = new THREE.DirectionalLight(16777215, 1);
			directionalLight.position.set(15, 20, 10);
			directionalLight.castShadow = true;
			directionalLight.shadow.camera.left = -30;
			directionalLight.shadow.camera.right = 30;
			directionalLight.shadow.camera.top = 30;
			directionalLight.shadow.camera.bottom = -30;
			directionalLight.shadow.mapSize.width = 1024;
			directionalLight.shadow.mapSize.height = 1024;
			scene.add(directionalLight);
		}
		const pointLight1 = new THREE.PointLight(16750592, isMobileScreen ? .4 : .8, 40);
		pointLight1.position.set(8, 6, 8);
		scene.add(pointLight1);
		if (!isMobileScreen) {
			const pointLight2 = new THREE.PointLight(49151, .6, 50);
			pointLight2.position.set(-10, 8, -10);
			scene.add(pointLight2);
		}
		function createTruck() {
			const group = new THREE.Group();
			if (isMobileScreen) {
				const cabinGeometry = new THREE.BoxGeometry(1.5, 2, 2);
				const cabinMaterial = new THREE.MeshStandardMaterial({
					color: 16739125,
					flatShading: true
				});
				const cabin = new THREE.Mesh(cabinGeometry, cabinMaterial);
				cabin.position.set(0, 1, 0);
				cabin.castShadow = false;
				cabin.receiveShadow = false;
				group.add(cabin);
				const trailerGeometry = new THREE.BoxGeometry(2, 1.5, 3.5);
				const trailerMaterial = new THREE.MeshStandardMaterial({
					color: 16753920,
					flatShading: true
				});
				const trailer = new THREE.Mesh(trailerGeometry, trailerMaterial);
				trailer.position.set(0, 1, 3);
				trailer.castShadow = false;
				trailer.receiveShadow = false;
				group.add(trailer);
				const wheelGeometry = new THREE.CylinderGeometry(.5, .5, .4, 8);
				const wheelMaterial = new THREE.MeshStandardMaterial({ color: 3355443 });
				[
					new THREE.Vector3(-1, .5, 1),
					new THREE.Vector3(1, .5, 1),
					new THREE.Vector3(-1, .5, 3),
					new THREE.Vector3(1, .5, 3)
				].forEach((position) => {
					const wheel = new THREE.Mesh(wheelGeometry, wheelMaterial);
					wheel.rotation.z = Math.PI / 2;
					wheel.position.copy(position);
					wheel.castShadow = false;
					wheel.receiveShadow = false;
					group.add(wheel);
				});
			} else {
				const cabinGeometry = new THREE.BoxGeometry(2, 2.5, 3);
				const cabinMaterial = new THREE.MeshStandardMaterial({ color: 16739125 });
				const cabin = new THREE.Mesh(cabinGeometry, cabinMaterial);
				cabin.position.set(0, 1.5, 0);
				cabin.castShadow = true;
				cabin.receiveShadow = true;
				group.add(cabin);
				const trailerGeometry = new THREE.BoxGeometry(3, 2, 5);
				const trailerMaterial = new THREE.MeshStandardMaterial({ color: 16753920 });
				const trailer = new THREE.Mesh(trailerGeometry, trailerMaterial);
				trailer.position.set(0, 1.5, 5);
				trailer.castShadow = true;
				trailer.receiveShadow = true;
				group.add(trailer);
				const wheelGeometry = new THREE.CylinderGeometry(.8, .8, .6, 16);
				const wheelMaterial = new THREE.MeshStandardMaterial({ color: 3355443 });
				[
					new THREE.Vector3(-1.5, .8, 1),
					new THREE.Vector3(1.5, .8, 1),
					new THREE.Vector3(-1.5, .8, -1),
					new THREE.Vector3(1.5, .8, -1),
					new THREE.Vector3(-1.5, .8, 4),
					new THREE.Vector3(1.5, .8, 4)
				].forEach((position) => {
					const wheel = new THREE.Mesh(wheelGeometry, wheelMaterial);
					wheel.rotation.z = Math.PI / 2;
					wheel.position.copy(position);
					wheel.castShadow = true;
					wheel.receiveShadow = true;
					group.add(wheel);
				});
			}
			group.position.set(isMobileScreen ? -4 : -8, 0, 0);
			return group;
		}
		function createJCB() {
			const group = new THREE.Group();
			if (isMobileScreen) {
				const bodyGeometry = new THREE.BoxGeometry(1.5, 1.5, 2);
				const bodyMaterial = new THREE.MeshStandardMaterial({
					color: 16763904,
					flatShading: true
				});
				const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
				body.position.set(0, 1, 0);
				body.castShadow = false;
				body.receiveShadow = false;
				group.add(body);
				const boomGeometry = new THREE.BoxGeometry(.3, .3, 2);
				const boomMaterial = new THREE.MeshStandardMaterial({ color: 13412864 });
				const boom = new THREE.Mesh(boomGeometry, boomMaterial);
				boom.position.set(0, 1.8, 1);
				boom.rotation.z = Math.PI / 6;
				boom.castShadow = false;
				boom.receiveShadow = false;
				group.add(boom);
				const wheelGeometry = new THREE.CylinderGeometry(.4, .4, .3, 8);
				const wheelMaterial = new THREE.MeshStandardMaterial({ color: 3355443 });
				[
					new THREE.Vector3(-.8, .4, .5),
					new THREE.Vector3(.8, .4, .5),
					new THREE.Vector3(-.8, .4, -.5),
					new THREE.Vector3(.8, .4, -.5)
				].forEach((position) => {
					const wheel = new THREE.Mesh(wheelGeometry, wheelMaterial);
					wheel.rotation.z = Math.PI / 2;
					wheel.position.copy(position);
					wheel.castShadow = false;
					wheel.receiveShadow = false;
					group.add(wheel);
				});
			} else {
				const bodyGeometry = new THREE.BoxGeometry(2.5, 2, 3);
				const bodyMaterial = new THREE.MeshStandardMaterial({ color: 16763904 });
				const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
				body.position.set(0, 1.2, 0);
				body.castShadow = true;
				body.receiveShadow = true;
				group.add(body);
				const boomGeometry = new THREE.BoxGeometry(.5, .5, 3);
				const boomMaterial = new THREE.MeshStandardMaterial({ color: 13412864 });
				const boom = new THREE.Mesh(boomGeometry, boomMaterial);
				boom.position.set(0, 2.5, 1.5);
				boom.rotation.z = Math.PI / 6;
				boom.castShadow = true;
				boom.receiveShadow = true;
				group.add(boom);
				const bucketGeometry = new THREE.BoxGeometry(1.5, 1, 1.5);
				const bucketMaterial = new THREE.MeshStandardMaterial({ color: 8947848 });
				const bucket = new THREE.Mesh(bucketGeometry, bucketMaterial);
				bucket.position.set(0, 3.5, 3);
				bucket.castShadow = true;
				bucket.receiveShadow = true;
				group.add(bucket);
				const wheelGeometry = new THREE.CylinderGeometry(.6, .6, .5, 16);
				const wheelMaterial = new THREE.MeshStandardMaterial({ color: 3355443 });
				[
					new THREE.Vector3(-1.2, .6, .8),
					new THREE.Vector3(1.2, .6, .8),
					new THREE.Vector3(-1.2, .6, -.8),
					new THREE.Vector3(1.2, .6, -.8)
				].forEach((position) => {
					const wheel = new THREE.Mesh(wheelGeometry, wheelMaterial);
					wheel.rotation.z = Math.PI / 2;
					wheel.position.copy(position);
					wheel.castShadow = true;
					wheel.receiveShadow = true;
					group.add(wheel);
				});
			}
			group.position.set(isMobileScreen ? 4 : 8, 0, 0);
			return group;
		}
		function createCrusher() {
			const group = new THREE.Group();
			if (isMobileScreen) {
				const hopperGeometry = new THREE.ConeGeometry(1.5, 1.2, 6);
				const hopperMaterial = new THREE.MeshStandardMaterial({
					color: 13382400,
					flatShading: true
				});
				const hopper = new THREE.Mesh(hopperGeometry, hopperMaterial);
				hopper.position.set(0, 1.2, 0);
				hopper.castShadow = false;
				hopper.receiveShadow = false;
				group.add(hopper);
				const chamberGeometry = new THREE.CylinderGeometry(1, .8, 1.5, 6);
				const chamberMaterial = new THREE.MeshStandardMaterial({
					color: 10027008,
					flatShading: true
				});
				const chamber = new THREE.Mesh(chamberGeometry, chamberMaterial);
				chamber.position.set(0, 0, 0);
				chamber.castShadow = false;
				chamber.receiveShadow = false;
				group.add(chamber);
			} else {
				const hopperGeometry = new THREE.ConeGeometry(2.5, 2, 8);
				const hopperMaterial = new THREE.MeshStandardMaterial({ color: 13382400 });
				const hopper = new THREE.Mesh(hopperGeometry, hopperMaterial);
				hopper.position.set(0, 2, 0);
				hopper.castShadow = true;
				hopper.receiveShadow = true;
				group.add(hopper);
				const chamberGeometry = new THREE.CylinderGeometry(1.8, 1.5, 3, 8);
				const chamberMaterial = new THREE.MeshStandardMaterial({ color: 10027008 });
				const chamber = new THREE.Mesh(chamberGeometry, chamberMaterial);
				chamber.position.set(0, 0, 0);
				chamber.castShadow = true;
				chamber.receiveShadow = true;
				group.add(chamber);
				const conveyorGeometry = new THREE.BoxGeometry(2, .8, 4);
				const conveyorMaterial = new THREE.MeshStandardMaterial({ color: 5592405 });
				const conveyor = new THREE.Mesh(conveyorGeometry, conveyorMaterial);
				conveyor.position.set(0, -1.5, 2);
				conveyor.rotation.z = -Math.PI / 8;
				conveyor.castShadow = true;
				conveyor.receiveShadow = true;
				group.add(conveyor);
			}
			group.position.set(0, 0, isMobileScreen ? -5 : -10);
			return group;
		}
		const groundGeometry = new THREE.PlaneGeometry(isMobileScreen ? 20 : 40, isMobileScreen ? 20 : 40);
		const groundMaterial = new THREE.MeshStandardMaterial({
			color: 2763306,
			roughness: .8
		});
		const ground = new THREE.Mesh(groundGeometry, groundMaterial);
		ground.rotation.x = -Math.PI / 2;
		ground.receiveShadow = !isMobileScreen;
		scene.add(ground);
		const truck = createTruck();
		const jcb = createJCB();
		const crusher = createCrusher();
		scene.add(truck);
		scene.add(jcb);
		scene.add(crusher);
		let animationId;
		const animate = () => {
			animationId = requestAnimationFrame(animate);
			const rotationSpeed = isMobileScreen ? 2e-4 : 5e-4;
			truck.rotation.y += rotationSpeed;
			jcb.rotation.y -= rotationSpeed * .6;
			crusher.rotation.y += rotationSpeed * .4;
			const bobScale = isMobileScreen ? .1 : .2;
			truck.position.y = Math.sin(Date.now() * .001) * bobScale;
			jcb.position.y = Math.sin(Date.now() * .001 + Math.PI / 3) * bobScale;
			crusher.position.y = Math.sin(Date.now() * .001 + 2 * Math.PI / 3) * bobScale;
			renderer.render(scene, camera);
		};
		animate();
		const handleResize = () => {
			if (!containerRef.current) return;
			const newWidth = containerRef.current.clientWidth;
			const newHeight = containerRef.current.clientHeight;
			camera.aspect = newWidth / newHeight;
			camera.updateProjectionMatrix();
			renderer.setSize(newWidth, newHeight);
		};
		window.addEventListener("resize", handleResize);
		return () => {
			window.removeEventListener("resize", handleResize);
			cancelAnimationFrame(animationId);
			renderer.dispose();
			containerRef.current?.removeChild(renderer.domElement);
		};
	}, [containerRef]);
	return null;
}
//#endregion
//#region src/routes/login.tsx?tsr-split=component
function LoginPage() {
	const navigate = useNavigate();
	const containerRef = useRef(null);
	const [username, setUsername] = useState("Admin");
	const [password, setPassword] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	useEffect(() => {
		if (localStorage.getItem("auth_token")) navigate({ to: "/" });
	}, [navigate]);
	async function handleSubmit(e) {
		e.preventDefault();
		if (!username || !password) {
			toast.error("Please enter username and password");
			return;
		}
		setIsLoading(true);
		try {
			const response = await login(username, password);
			localStorage.setItem("auth_token", response.token);
			localStorage.setItem("user", JSON.stringify(response.user));
			toast.success("Login successful!");
			navigate({ to: "/" });
		} catch (error) {
			toast.error(error instanceof Error ? error.message : "Login failed");
			setPassword("");
		} finally {
			setIsLoading(false);
		}
	}
	return /* @__PURE__ */ jsxs("div", {
		className: "relative min-h-screen w-full overflow-hidden bg-slate-950 flex flex-col md:flex-row",
		children: [
			/* @__PURE__ */ jsx("div", {
				ref: containerRef,
				className: "absolute inset-0 w-full h-full",
				style: { zIndex: 0 },
				children: /* @__PURE__ */ jsx(Scene3D, { containerRef })
			}),
			/* @__PURE__ */ jsx("div", {
				className: "absolute inset-0 bg-gradient-to-r from-slate-900/85 via-slate-900/70 to-slate-900/85 md:from-slate-900/80 md:via-slate-900/60 md:to-slate-900/80",
				style: { zIndex: 1 }
			}),
			/* @__PURE__ */ jsx("div", {
				className: "relative z-10 flex min-h-screen w-full items-center justify-center px-3 sm:px-4 md:px-6",
				children: /* @__PURE__ */ jsxs("div", {
					className: "w-full max-w-sm sm:max-w-md",
					children: [/* @__PURE__ */ jsxs("div", {
						className: "mb-6 sm:mb-8 text-center",
						children: [
							/* @__PURE__ */ jsx("div", {
								className: "mb-3 sm:mb-4 inline-flex h-16 w-16 sm:h-20 sm:w-20 items-center justify-center rounded-full bg-gradient-to-br from-primary via-primary/80 to-primary/60 shadow-xl shadow-primary/50",
								children: /* @__PURE__ */ jsxs("div", {
									className: "flex flex-col items-center justify-center",
									children: [/* @__PURE__ */ jsx("span", {
										className: "text-xl sm:text-2xl font-bold text-white",
										children: "HE"
									}), /* @__PURE__ */ jsx(Zap, { className: "h-2.5 w-2.5 sm:h-3 sm:w-3 text-white mt-0.5" })]
								})
							}),
							/* @__PURE__ */ jsx("h1", {
								className: "font-display text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-primary to-orange-400 bg-clip-text text-transparent",
								children: "Honey Enterprises"
							}),
							/* @__PURE__ */ jsx("p", {
								className: "mt-2 sm:mt-3 text-xs sm:text-sm text-slate-300 font-medium line-clamp-2 sm:line-clamp-none",
								children: "Stone Crusher • Aggregate Trading • Transport"
							})
						]
					}), /* @__PURE__ */ jsxs("div", {
						className: "rounded-2xl border border-primary/30 bg-slate-900/50 p-5 sm:p-6 md:p-8 shadow-2xl backdrop-blur-xl",
						children: [
							/* @__PURE__ */ jsx("h2", {
								className: "mb-1.5 sm:mb-2 text-center font-display text-lg sm:text-xl font-bold text-white",
								children: "Admin Portal"
							}),
							/* @__PURE__ */ jsx("p", {
								className: "mb-5 sm:mb-6 text-center text-xs text-slate-400",
								children: "Enterprise Management System"
							}),
							/* @__PURE__ */ jsxs("form", {
								onSubmit: handleSubmit,
								className: "space-y-4 sm:space-y-5",
								children: [
									/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("label", {
										htmlFor: "username",
										className: "block text-xs sm:text-xs font-semibold text-slate-300 mb-1.5 sm:mb-2",
										children: "Username"
									}), /* @__PURE__ */ jsxs("div", {
										className: "relative",
										children: [/* @__PURE__ */ jsx(Mail, { className: "absolute left-3 top-3 sm:top-3.5 h-4 w-4 text-primary/60" }), /* @__PURE__ */ jsx(Input, {
											id: "username",
											type: "text",
											placeholder: "Enter username",
											value: username,
											onChange: (e) => setUsername(e.target.value),
											className: "pl-10 bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-500 focus:border-primary/50 focus:ring-primary/50 text-sm sm:text-base py-2 sm:py-2.5",
											disabled: isLoading,
											autoComplete: "username"
										})]
									})] }),
									/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("label", {
										htmlFor: "password",
										className: "block text-xs sm:text-xs font-semibold text-slate-300 mb-1.5 sm:mb-2",
										children: "Password"
									}), /* @__PURE__ */ jsxs("div", {
										className: "relative",
										children: [/* @__PURE__ */ jsx(Lock, { className: "absolute left-3 top-3 sm:top-3.5 h-4 w-4 text-primary/60" }), /* @__PURE__ */ jsx(Input, {
											id: "password",
											type: "password",
											placeholder: "Enter password",
											value: password,
											onChange: (e) => setPassword(e.target.value),
											className: "pl-10 bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-500 focus:border-primary/50 focus:ring-primary/50 text-sm sm:text-base py-2 sm:py-2.5",
											disabled: isLoading,
											autoComplete: "current-password"
										})]
									})] }),
									/* @__PURE__ */ jsx(Button, {
										type: "submit",
										className: "w-full mt-6 sm:mt-7 bg-gradient-to-r from-primary to-orange-500 hover:from-primary/90 hover:to-orange-500/90 text-white font-semibold shadow-lg shadow-primary/50 text-sm sm:text-base py-2.5 sm:py-3 h-auto",
										disabled: isLoading,
										size: "lg",
										children: isLoading ? /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsx(Loader2, { className: "mr-2 h-4 w-4 animate-spin" }), "Signing in..."] }) : /* @__PURE__ */ jsxs(Fragment, { children: [
											/* @__PURE__ */ jsx(Zap, { className: "mr-2 h-4 w-4" }),
											/* @__PURE__ */ jsx("span", {
												className: "hidden sm:inline",
												children: "Sign In"
											}),
											/* @__PURE__ */ jsx("span", {
												className: "sm:hidden",
												children: "Login"
											})
										] })
									})
								]
							})
						]
					})]
				})
			})
		]
	});
}
//#endregion
export { LoginPage as component };
