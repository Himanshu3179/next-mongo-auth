"use client"
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import React from 'react'
import { useToast } from '@/components/ui/use-toast';
import { Loader2Icon, LoaderIcon } from 'lucide-react';

declare global {
    interface Window {
        Razorpay: any;
    }
}
interface RazorpayResponse {
    razorpay_payment_id: string;
    razorpay_order_id: string;
    razorpay_signature: string;
}

const DonationForm = () => {
    const [amount, setAmount] = React.useState(10);
    const [receipt, setReceipt] = React.useState({});
    const [isLoading, setIsLoading] = React.useState(false);

    const { toast } = useToast()
    const makePayment = async () => {
        setIsLoading(true);
        console.log(amount);
        const res = await initializeRazorpay();
        if (!res) {
            alert("Razorpay SDK Failed to load");
            setIsLoading(false);
            return;
        }

        try {
            const response = await fetch("/api/razorpay",
                {
                    method: "POST",
                    body: JSON.stringify({ amount }),
                }
            );
            const data = await response.json();
            console.log(data);
            var options = {
                key: process.env.RAZORPAY_KEY, // Enter the Key ID generated from the Dashboard
                name: "Himanshu Singh Pvt Ltd",
                currency: data.currency,
                amount: data.amount,
                order_id: data.id,
                description: "Thankyou for your test donation",
                handler: async function (response: RazorpayResponse) {
                    // alert(response.razorpay_payment_id);
                    // alert(response.razorpay_order_id);
                    // alert(response.razorpay_signature);
                    setReceipt(response);
                    toast({
                        title: "Success",
                        description: "Payment Success",
                        variant: 'default'
                    })

                    try {
                        const res = await fetch('/api/email', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify({
                                subject: 'Payment Successful',
                                message: `Your payment with ID ${response.razorpay_payment_id} was successful.`,
                            }),
                        })
                        if (res.ok) {
                            toast({
                                title: "Success",
                                description: "Email sent",
                                variant: 'default'
                            })
                        }
                        else {
                            toast({
                                title: "Error",
                                description: "Email not sent",
                                variant: 'destructive'
                            })
                        }
                    } catch (error) {
                        console.log(error);
                        toast({
                            title: "Error",
                            description: "Email not sent",
                            variant: 'destructive'
                        })
                    }
                },
            };
            const paymentObject = new window.Razorpay(options);
            paymentObject.open();
            setIsLoading(false);
        } catch (error: any) {
            console.error('Here Error:', error);
            toast({
                title: "Error",
                description: "Cannot process payment",
                variant: 'destructive'
            })
            setIsLoading(false); // Set loading to false if there was an error

        }

    };
    const initializeRazorpay = () => {
        return new Promise((resolve) => {
            const script = document.createElement("script");
            script.src = "https://checkout.razorpay.com/v1/checkout.js";
            script.onload = () => {
                resolve(true);
            };
            script.onerror = () => {
                resolve(false);
            };
            document.body.appendChild(script);
        });

    };
    return (
        <div className='text-center flex flex-col '>
            <h1 className='text-3xl '>Donate</h1>
            <div className='flex gap-2 m-5'>
                <Input placeholder='Amount (in rupees)'
                    onChange={(e) => setAmount(parseInt(e.target.value))}
                    value={amount}
                    type='number'
                />
                <Button onClick={makePayment}
                    disabled={isLoading}

                >
                    {isLoading ? <Loader2Icon className='animate-spin' /> : 'Donate'}
                </Button>
            </div>
            <hr />
            <p className='m-2'>or</p>
            <hr />
            <div className="sample-buttons mt-5 flex gap-3 justify-between">
                <Button onClick={() => setAmount(10)} className='rounded-full p-6 border '>10</Button>
                <Button onClick={() => setAmount(100)} className='rounded-full p-6 border '>100</Button>
                <Button onClick={() => setAmount(500)} className='rounded-full p-6 border '>500</Button>
                <Button onClick={() => setAmount(1000)} className='rounded-full p-6 border '>1000</Button>
            </div>
        </div>
    )
}

export default DonationForm