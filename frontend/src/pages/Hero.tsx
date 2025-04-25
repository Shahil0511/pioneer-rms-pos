import { Clock, CheckCircle, Smartphone, BarChart, Utensils, Coffee, Pizza, Salad } from "lucide-react";
import { Button } from "../components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { FaFacebook, FaInstagram, FaTwitter } from "react-icons/fa";

interface HeroProps {
    onLoginClick: () => void;
    onSignupClick: () => void;
}

export const Hero = ({ onLoginClick, onSignupClick }: HeroProps) => {
    return (
        <>
            {/* Hero Section */}
            <main className="container mx-auto px-4 py-12 md:py-20">
                <div className="flex flex-col md:flex-row items-center justify-between gap-12">
                    <div className="md:w-1/2 space-y-8">
                        <h1 className="text-4xl md:text-6xl font-bold leading-tight bg-gradient-to-r from-primary to-orange-600 bg-clip-text text-transparent">
                            Deliciously <span className="block">Efficient POS</span>
                        </h1>
                        <p className="text-xl text-muted-foreground">
                            The ultimate point of sale system designed specifically for <span className="font-semibold text-primary">restaurants and cafes</span>.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4">
                            <Button
                                onClick={onLoginClick}
                                className="flex items-center gap-2 px-8 py-6 text-lg bg-primary hover:bg-orange-600 transition-colors"
                            >
                                Get Started
                                <span className="ml-1">→</span>
                            </Button>
                            <Button
                                variant="outline"
                                onClick={onSignupClick}
                                className="flex items-center gap-2 px-8 py-6 text-lg border-primary text-primary hover:bg-orange-50 dark:hover:bg-orange-900/20"
                            >
                                Create Account
                            </Button>
                        </div>

                        <div className="flex items-center gap-4 pt-4">
                            <div className="flex -space-x-2">
                                {[1, 2, 3].map((item) => (
                                    <div
                                        key={item}
                                        className="h-10 w-10 rounded-full bg-orange-100 border-2 border-white dark:border-gray-900 flex items-center justify-center text-orange-600 font-medium"
                                    >
                                        {item === 1 ? <Utensils size={16} /> : item === 2 ? <Coffee size={16} /> : <Pizza size={16} />}
                                    </div>
                                ))}
                            </div>
                            <p className="text-sm text-muted-foreground">
                                Trusted by <span className="font-medium text-primary">500+</span> restaurants worldwide
                            </p>
                        </div>
                    </div>

                    <div className="md:w-1/2 relative">
                        <div className="absolute -top-6 -right-6 h-64 w-64 rounded-full bg-orange-100/50 dark:bg-orange-900/10 blur-3xl -z-10"></div>
                        <Card className="border-primary/20 shadow-lg hover:shadow-xl transition-shadow">
                            <CardHeader className="bg-gradient-to-r from-primary/5 to-orange-50 dark:from-orange-900/10 dark:to-orange-900/5 p-4 flex flex-row items-center gap-2 border-b border-primary/10">
                                <div className="h-3 w-3 rounded-full bg-red-500"></div>
                                <div className="h-3 w-3 rounded-full bg-yellow-500"></div>
                                <div className="h-3 w-3 rounded-full bg-green-500"></div>
                                <div className="flex-1 text-center text-sm font-medium text-primary">
                                    New Order
                                </div>
                            </CardHeader>
                            <CardContent className="p-6">
                                <div className="flex justify-between items-center mb-6">
                                    <CardTitle className="text-lg font-bold">Order #142</CardTitle>
                                    <div className="flex items-center space-x-1 text-sm text-primary">
                                        <Clock className="h-4 w-4" />
                                        <span>12:34 PM</span>
                                    </div>
                                </div>

                                <div className="space-y-4 mb-6">
                                    {[
                                        { name: "Margherita Pizza", price: "$12.99", icon: <Pizza className="h-4 w-4 text-orange-500" /> },
                                        { name: "Caesar Salad", price: "$8.99", icon: <Salad className="h-4 w-4 text-green-500" /> },
                                        { name: "Garlic Bread", price: "$4.99", icon: <Utensils className="h-4 w-4 text-amber-500" /> }
                                    ].map((item, index) => (
                                        <div key={index} className="flex justify-between items-center group">
                                            <div className="flex items-center gap-3">
                                                <div className="p-1.5 rounded-md bg-orange-50 dark:bg-orange-900/20 group-hover:bg-orange-100 dark:group-hover:bg-orange-900/30 transition-colors">
                                                    {item.icon}
                                                </div>
                                                <span>{item.name}</span>
                                            </div>
                                            <span className="font-medium">{item.price}</span>
                                        </div>
                                    ))}
                                </div>

                                <div className="border-t pt-4 border-muted">
                                    <div className="flex justify-between font-bold text-lg">
                                        <span>Total</span>
                                        <span className="text-primary">$26.97</span>
                                    </div>
                                </div>
                            </CardContent>
                            <CardFooter className="p-4 bg-muted/20 border-t">
                                <Button className="w-full bg-primary hover:bg-orange-600">
                                    Process Payment
                                </Button>
                            </CardFooter>
                        </Card>
                    </div>
                </div>
            </main>

            {/* Features Section */}
            <section className="py-16 bg-gradient-to-b from-orange-50/50 to-background dark:from-orange-900/10">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-16">
                        <span className="inline-block px-3 py-1 text-sm font-medium rounded-full bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-200 mb-4">
                            Why Choose Us
                        </span>
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">Everything You Need to <span className="text-primary">Succeed</span></h2>
                        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                            Our POS system is packed with features designed to streamline your restaurant operations.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            {
                                title: "Mobile Friendly",
                                description: "Access your POS from any device, anywhere with our responsive interface.",
                                icon: <Smartphone className="h-6 w-6" />,
                                color: "text-primary"
                            },
                            {
                                title: "Easy to Use",
                                description: "Intuitive interface designed for quick staff training and efficient operations.",
                                icon: <CheckCircle className="h-6 w-6" />,
                                color: "text-green-500"
                            },
                            {
                                title: "Real-time Analytics",
                                description: "Track sales, inventory, and customer preferences with live dashboards.",
                                icon: <BarChart className="h-6 w-6" />,
                                color: "text-blue-500"
                            }
                        ].map((feature, index) => (
                            <Card key={index} className="hover:shadow-lg transition-shadow group border-primary/10">
                                <CardContent className="p-8">
                                    <div className={`flex items-center justify-center h-14 w-14 rounded-full bg-orange-50 ${feature.color} mb-6 dark:bg-orange-900/20 group-hover:bg-orange-100 dark:group-hover:bg-orange-900/30 transition-colors`}>
                                        {feature.icon}
                                    </div>
                                    <CardTitle className="text-xl font-semibold mb-3">{feature.title}</CardTitle>
                                    <CardDescription className="text-muted-foreground">
                                        {feature.description}
                                    </CardDescription>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>

            {/* Testimonial Section */}
            <section className="py-16 bg-muted/30">
                <div className="container mx-auto px-4">
                    <Card className="border-primary/20 overflow-hidden">
                        <div className="md:flex">
                            <div className="md:w-1/2 p-12 bg-gradient-to-br from-primary to-orange-600 text-white">
                                <h3 className="text-2xl font-bold mb-4">Join Thousands of Happy Restaurants</h3>
                                <p className="mb-6 opacity-90">
                                    "Since implementing this POS system, our order processing time has decreased by 40% and customer satisfaction has skyrocketed."
                                </p>
                                <div className="flex items-center gap-4">
                                    <div className="h-12 w-12 rounded-full bg-white/20 flex items-center justify-center">
                                        <Utensils className="h-6 w-6" />
                                    </div>
                                    <div>
                                        <p className="font-medium">Maria Rodriguez</p>
                                        <p className="text-sm opacity-80">Owner, Bella Cucina</p>
                                    </div>
                                </div>
                            </div>
                            <div className="md:w-1/2 p-12">
                                <h3 className="text-2xl font-bold mb-6">Ready to Transform Your Business?</h3>
                                <div className="space-y-4">
                                    <Input placeholder="Your restaurant name" className="py-6" />
                                    <Input placeholder="Email address" className="py-6" />
                                    <Button className="w-full py-6 bg-primary hover:bg-orange-600 text-lg">
                                        Request Demo
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </Card>
                </div>
            </section>

            {/* Footer */}
            <footer className="py-12 bg-gradient-to-b from-muted/30 to-background border-t">
                <div className="container mx-auto px-4">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-8">
                        <div className="flex items-center gap-2">
                            <div className="h-10 w-10 rounded-full bg-primary flex items-center justify-center text-white">
                                <Utensils className="h-5 w-5" />
                            </div>
                            <span className="text-xl font-bold">PionerPOS</span>
                        </div>
                        <div className="flex flex-wrap gap-6 justify-center">
                            <a href="#" className="text-muted-foreground hover:text-primary transition-colors">Features</a>
                            <a href="#" className="text-muted-foreground hover:text-primary transition-colors">Pricing</a>
                            <a href="#" className="text-muted-foreground hover:text-primary transition-colors">About</a>
                            <a href="#" className="text-muted-foreground hover:text-primary transition-colors">Contact</a>
                        </div>
                        <div className="flex gap-4">
                            <Button
                                variant="outline"
                                size="icon"
                                className="border-primary/30 text-primary hover:bg-orange-50 dark:hover:bg-orange-900/20"
                            >
                                <span className="sr-only">Twitter</span>
                                <FaTwitter className="h-5 w-5" />
                            </Button>
                            <Button
                                variant="outline"
                                size="icon"
                                className="border-primary/30 text-primary hover:bg-orange-50 dark:hover:bg-orange-900/20"
                            >
                                <span className="sr-only">Facebook</span>
                                <FaFacebook className="h-5 w-5" />
                            </Button>
                            <Button
                                variant="outline"
                                size="icon"
                                className="border-primary/30 text-primary hover:bg-orange-50 dark:hover:bg-orange-900/20"
                            >
                                <span className="sr-only">Instagram</span>
                                <FaInstagram className="h-5 w-5" />
                            </Button>
                        </div>
                    </div>
                    <div className="mt-12 pt-8 border-t border-muted text-center">
                        <p className="text-muted-foreground">
                            © {new Date().getFullYear()} PionerPOS. All rights reserved.
                        </p>
                    </div>
                </div>
            </footer>
        </>
    );
};