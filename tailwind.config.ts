
import type { Config } from "tailwindcss";

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
		extend: {
			fontFamily: {
				'montserrat': ['Montserrat', 'sans-serif'],
			},
			colors: {
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
				sidebar: {
					DEFAULT: 'hsl(var(--sidebar-background))',
					foreground: 'hsl(var(--sidebar-foreground))',
					primary: 'hsl(var(--sidebar-primary))',
					'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
					accent: 'hsl(var(--sidebar-accent))',
					'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
					border: 'hsl(var(--sidebar-border))',
					ring: 'hsl(var(--sidebar-ring))'
				}
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			keyframes: {
				'accordion-down': {
					from: {
						height: '0'
					},
					to: {
						height: 'var(--radix-accordion-content-height)'
					}
				},
				'accordion-up': {
					from: {
						height: 'var(--radix-accordion-content-height)'
					},
					to: {
						height: '0'
					}
				},
				'fade-in': {
					'0%': {
						opacity: '0',
						transform: 'translateY(30px)'
					},
					'100%': {
						opacity: '1',
						transform: 'translateY(0)'
					}
				},
				'float': {
					'0%, 100%': {
						transform: 'translateY(0px) rotate(0deg)'
					},
					'50%': {
						transform: 'translateY(-20px) rotate(5deg)'
					}
				},
				'float-once': {
					'0%': {
						transform: 'translateY(30px) rotate(-5deg)',
						opacity: '0'
					},
					'100%': {
						transform: 'translateY(0px) rotate(0deg)',
						opacity: '1'
					}
				},
				'pulse-once': {
					'0%': {
						opacity: '0',
						transform: 'scale(0.8)'
					},
					'50%': {
						opacity: '0.8',
						transform: 'scale(1.1)'
					},
					'100%': {
						opacity: '0.6',
						transform: 'scale(1)'
					}
				},
				'plane-fly': {
					'0%': {
						transform: 'translateX(-150px) translateY(0px) rotate(0deg)',
						opacity: '0'
					},
					'10%': {
						opacity: '1'
					},
					'90%': {
						opacity: '1'
					},
					'100%': {
						transform: 'translateX(150vw) translateY(-50px) rotate(5deg)',
						opacity: '0'
					}
				},
				'gradient-x': {
					'0%, 100%': {
						'background-size': '200% 200%',
						'background-position': 'left center'
					},
					'50%': {
						'background-size': '200% 200%',
						'background-position': 'right center'
					}
				},
				'gradient-xy': {
					'0%, 100%': {
						'background-size': '400% 400%',
						'background-position': 'left center'
					},
					'50%': {
						'background-size': '400% 400%',
						'background-position': 'right center'
					}
				},
				'slide-right': {
					'0%': {
						transform: 'translateX(-100%)'
					},
					'100%': {
						transform: 'translateX(100%)'
					}
				},
				'slide-left': {
					'0%': {
						transform: 'translateX(100%)'
					},
					'100%': {
						transform: 'translateX(-100%)'
					}
				},
				'booth-build-1': {
					'0%': {
						opacity: '0',
						transform: 'translateY(-50px) rotateX(45deg)'
					},
					'100%': {
						opacity: '1',
						transform: 'translateY(0px) rotateX(10deg)'
					}
				},
				'booth-build-2': {
					'0%': {
						opacity: '0',
						transform: 'translateX(-50px) rotateY(90deg)'
					},
					'100%': {
						opacity: '1',
						transform: 'translateX(0px) rotateY(45deg)'
					}
				},
				'booth-build-3': {
					'0%': {
						opacity: '0',
						transform: 'translateX(50px) rotateY(-90deg)'
					},
					'100%': {
						opacity: '1',
						transform: 'translateX(0px) rotateY(-45deg)'
					}
				},
				'booth-build-4': {
					'0%': {
						opacity: '0',
						transform: 'translateY(50px) rotateX(-45deg)'
					},
					'100%': {
						opacity: '1',
						transform: 'translateY(0px) rotateX(45deg)'
					}
				},
				'booth-build-5': {
					'0%': {
						opacity: '0',
						transform: 'scale(0.5)'
					},
					'100%': {
						opacity: '1',
						transform: 'scale(1)'
					}
				},
				'booth-build-6': {
					'0%': {
						opacity: '0',
						transform: 'translateY(20px) scale(0.8)'
					},
					'100%': {
						opacity: '1',
						transform: 'translateY(0px) scale(1)'
					}
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'fade-in': 'fade-in 0.8s ease-out forwards',
				'float': 'float 6s ease-in-out infinite',
				'float-once': 'float-once 1s ease-out forwards',
				'pulse-once': 'pulse-once 2s ease-out forwards',
				'plane-fly': 'plane-fly 12s ease-in-out infinite',
				'gradient-x': 'gradient-x 3s ease infinite',
				'gradient-xy': 'gradient-xy 8s ease infinite',
				'slide-right': 'slide-right 8s linear infinite',
				'slide-left': 'slide-left 8s linear infinite',
				'booth-build-1': 'booth-build-1 1s ease-out forwards 0.5s',
				'booth-build-2': 'booth-build-2 0.8s ease-out forwards 1s',
				'booth-build-3': 'booth-build-3 0.8s ease-out forwards 1.2s',
				'booth-build-4': 'booth-build-4 0.6s ease-out forwards 1.8s',
				'booth-build-5': 'booth-build-5 0.5s ease-out forwards 2.2s',
				'booth-build-6': 'booth-build-6 0.4s ease-out forwards 2.6s'
			},
			perspective: {
				'1000': '1000px'
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
