import {
    Card,
    CardAction,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
function Signup() {
    const [inputData, setInputData] = useState({
        name: '',
        email: '',
        password: ""
    });
    const navigate = useNavigate();
    const handleInputs = (e) => {
        const { name, value } = e.target;

        setInputData(prev => ({
            ...prev, [name]: value
        }))
    }
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:8080/register/signup', inputData);
            console.log('Signup successful!', response.data);
            alert('Account created successfully!');
            navigate('/login')
        } catch (error) {
            console.log('error at handling form submission', error.message)
        }
    }

    return (
        <section className="flex items-center justify-center">
            <Card className="w-full max-w-sm ">
                <CardHeader >
                    <CardTitle className="flex items-center justify-between">Create your account</CardTitle>
                    <CardDescription>
                        Enter your email below to signUp
                    </CardDescription>
                    <CardAction>
                        <Button variant="link" onClick={() => navigate("/login")}>Login</Button>
                    </CardAction>
                </CardHeader>
                <CardContent>
                    <form>
                        <div className="flex flex-col gap-6">
                            <div className="grid gap-2">
                                <Label htmlFor="name">Name</Label>
                                <Input
                                    id="name"
                                    type="name"
                                    name='name'
                                    value={inputData.name}
                                    onChange={handleInputs}
                                    placeholder="Enter your name"
                                    required
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    name='email'
                                    value={inputData.email}
                                    onChange={handleInputs}
                                    placeholder="m@example.com"
                                    required
                                />
                            </div>
                            <div className="grid gap-2">
                                <div className="flex items-center">
                                    <Label htmlFor="password">Password</Label>
                                    {/* <a
                  href="#"
                  className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                >
                  Forgot your password?
                </a> */}
                                </div>
                                <Input id="password" name='password' type="password" onChange={handleInputs} value={inputData.password} required />
                            </div>
                        </div>
                    </form>
                </CardContent>
                <CardFooter className="flex-col gap-2">
                    <Button type="submit" onClick={handleSubmit} className="w-full">
                        Signup
                    </Button>
                </CardFooter>
            </Card>
        </section>
    )
}
export default Signup;