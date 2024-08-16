import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'

import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"

import { Link } from 'react-router-dom';

// Define the schema with confirm password validation
const formSchema = z
    .object({
        username: z.string().min(2, {
            message: "Username must be at least 2 characters.",
        }),
        email: z.string().regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, {
            message: "Invalid email address.",
        }),
        password: z
            .string()
            .min(8, {
                message: "Password must be at least 8 characters long.",
            })
            .regex(/[a-zA-Z]/, {
                message: "Password must contain at least one letter.",
            })
            .regex(/[^a-zA-Z0-9]/, {
                message: "Password must contain at least one special character.",
            }),
        confirmPassword: z.string(),
    })
    .refine((data) => data.password === data.confirmPassword, {
        path: ["confirmPassword"],
        message: "Passwords do not match",
    });

const RegisterForm = () => {
    const navigate = useNavigate();

    // 1. Define your form.
    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            username: "",
            email: "",
            password: "",
            confirmPassword: "",
        },
    });

    // 2. Define a submit handler.
    const onSubmit = (values) => {
        // Do something with the form values.
        axios.post('http://localhost:5001/api/register', {
            username: values.username,
            email: values.email,
            password: values.password,
        })
            .then((res) => {
                toast.success('Registration successful! Redirecting to home page...', {
                    position: "top-center",
                    autoClose: 2000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });
                // wait for 3 secs before navigate to the main page
                setTimeout(() => {
                    navigate("/");
                }, 3000);
            })
            .catch(error => {
                console.error('There was an error registering the user!', error);
                toast.error('Registration failed! Please try again.', {
                    position: "top-center",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });
            })

        console.log(values);
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <FormField
                    control={form.control}
                    name="username"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Username</FormLabel>
                            <FormControl>
                                <Input placeholder="shadcn" {...field} />
                            </FormControl>
                            <FormDescription>
                                This is your public display name.
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>E-mail</FormLabel>
                            <FormControl>
                                <Input type="email" placeholder="you@example.com" {...field} />
                            </FormControl>
                            <FormDescription>
                                Please enter a valid email address.
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Password</FormLabel>
                            <FormControl>
                                <Input type="password" placeholder="******" {...field} />
                            </FormControl>
                            <FormDescription>
                                Must be at least 8 characters long, contain one letter and one
                                special character.
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="confirmPassword"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Confirm Password</FormLabel>
                            <FormControl>
                                <Input type="password" placeholder="******" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <div className="flex justify-between">
                    <Link to="/">
                        <Button className="px-20" variant="outline">Cancel</Button>
                    </Link>
                    <Button className="px-20" type="submit">Submit</Button>
                </div>
                {/*<Button type="submit">Submit</Button>*/}
            </form>
        </Form>
    );
};

const RegisterPage = () => {
    return (
        <div className="flex justify-center items-center h-screen bg-gray-100">
            <Card className="w-[500px]">
                <CardHeader>
                    <CardTitle>Register</CardTitle>
                    <CardDescription>Please complete your information here.</CardDescription>
                </CardHeader>
                <CardContent>
                    <RegisterForm />
                </CardContent>
            </Card>
        </div>
    );
}

export default RegisterPage;


