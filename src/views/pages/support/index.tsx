'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  MessageSquare,
  Phone,
  Mail,
  Package,
  Truck,
  CreditCard,
  Undo2,
  User,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Separator } from '@/components/ui/separator';

// Mock FAQ data - replace with API call later
const faqData = [
  {
    id: 'faq-1',
    question: 'How do I track my order?',
    answer:
      'You can track your order in real-time by visiting your account dashboard and clicking on "My Orders". You\'ll receive email notifications at each stage of your delivery.',
  },
  {
    id: 'faq-2',
    question: 'What is your return policy?',
    answer:
      "We offer a 30-day return policy for most items. Products must be in original condition with all packaging. Simply initiate a return from your account, and we'll provide a prepaid shipping label.",
  },
  {
    id: 'faq-3',
    question: 'How long does shipping take?',
    answer:
      'Standard shipping typically takes 5-7 business days. Express shipping is available for 2-3 business days. Shipping times are calculated from the order confirmation date.',
  },
  {
    id: 'faq-4',
    question: 'Do you offer international shipping?',
    answer:
      'Yes, we ship to over 150 countries worldwide. International shipping rates and delivery times vary by location. You can check shipping costs at checkout before completing your purchase.',
  },
  {
    id: 'faq-5',
    question: 'How do I reset my password?',
    answer:
      'Click "Forgot Password" on the login page and enter your email address. You\'ll receive a password reset link within minutes. Follow the instructions to create a new password.',
  },
  {
    id: 'faq-6',
    question: 'Are my payment details secure?',
    answer:
      'Yes, we use industry-standard SSL encryption and PCI DSS compliance to protect your payment information. We never store full credit card details on our servers.',
  },
];

// Mock contact options data
const contactOptions = [
  {
    id: 'live-chat',
    icon: MessageSquare,
    title: 'Live Chat',
    description: 'Chat with our support team in real-time',
    availability: 'Available 24/7',
  },
  {
    id: 'email',
    icon: Mail,
    title: 'Email Support',
    description: "Send us an email and we'll respond within 24 hours",
    availability: 'support@example.com',
  },
  {
    id: 'phone',
    icon: Phone,
    title: 'Phone Support',
    description: 'Call our dedicated support team',
    availability: '+1 (555) 123-4567',
  },
];

// Mock help topics data
const helpTopics = [
  {
    id: 'orders',
    icon: Package,
    title: 'Orders',
    description: 'Track, modify, or cancel your orders',
  },
  {
    id: 'shipping',
    icon: Truck,
    title: 'Shipping',
    description: 'Learn about delivery options and rates',
  },
  {
    id: 'payments',
    icon: CreditCard,
    title: 'Payments',
    description: 'Payment methods and billing questions',
  },
  {
    id: 'returns',
    icon: Undo2,
    title: 'Returns',
    description: 'Return or exchange your items',
  },
  {
    id: 'account',
    icon: User,
    title: 'Account',
    description: 'Manage your profile and preferences',
  },
  {
    id: 'products',
    icon: Package,
    title: 'Products',
    description: 'Product information and specifications',
  },
];

export default function SupportPage() {
  const [openFaq, setOpenFaq] = useState<string | undefined>('faq-1');

  return (
    <main className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="py-16 md:py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-muted/50 to-background">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
            We&apos;re Here to Help
          </h1>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Find answers to common questions or get in touch with our support
            team. We&apos;re committed to providing you with the best customer
            experience.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/contact">
              <Button size="lg" className="w-full sm:w-auto">
                Contact Support
              </Button>
            </Link>
            <Button
              size="lg"
              variant="outline"
              className="w-full sm:w-auto bg-transparent"
            >
              Visit Help Center
            </Button>
          </div>
        </div>
      </section>

      {/* Contact Options Section */}
      <section className="py-16 md:py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Get in Touch
            </h2>
            <p className="text-muted-foreground text-lg">
              Choose the support method that works best for you
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {contactOptions.map((option) => {
              const Icon = option.icon;
              return (
                <Card
                  key={option.id}
                  className="hover:shadow-lg transition-shadow"
                >
                  <CardHeader>
                    <div className="flex items-center gap-3 mb-2">
                      <div className="p-2 bg-primary/10 rounded-lg">
                        <Icon className="w-6 h-6 text-primary" />
                      </div>
                      <CardTitle className="text-xl">{option.title}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground mb-4">
                      {option.description}
                    </p>
                    <p className="text-sm font-medium text-primary">
                      {option.availability}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      <Separator />

      {/* FAQ Section */}
      <section className="py-16 md:py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-muted-foreground text-lg">
              Find quick answers to the most common questions
            </p>
          </div>
          <Accordion
            value={openFaq}
            onValueChange={setOpenFaq}
            type="single"
            collapsible
          >
            {faqData.map((faq) => (
              <AccordionItem key={faq.id} value={faq.id} className="border-b">
                <AccordionTrigger className="py-4 hover:no-underline hover:text-primary transition-colors">
                  <span className="text-left font-medium">{faq.question}</span>
                </AccordionTrigger>
                <AccordionContent className="pb-4 text-muted-foreground">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      <Separator />

      {/* Help Topics Section */}
      <section className="py-16 md:py-24 px-4 sm:px-6 lg:px-8 bg-muted/30">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Browse Help Topics
            </h2>
            <p className="text-muted-foreground text-lg">
              Explore our comprehensive guides and resources
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {helpTopics.map((topic) => {
              const Icon = topic.icon;
              return (
                <Card
                  key={topic.id}
                  className="hover:shadow-lg hover:border-primary/50 transition-all cursor-pointer group"
                >
                  <CardHeader>
                    <div className="flex items-start justify-between mb-3">
                      <div className="p-3 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-colors">
                        <Icon className="w-6 h-6 text-primary" />
                      </div>
                    </div>
                    <CardTitle className="text-lg">{topic.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground text-sm">
                      {topic.description}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <Card className="bg-primary/5 border-primary/20">
            <CardHeader>
              <CardTitle className="text-2xl md:text-3xl mb-2">
                Didn&apos;t find what you&apos;re looking for?
              </CardTitle>
              <CardDescription className="text-base">
                Submit a support request and our team will get back to you as
                soon as possible
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/contact">
                <Button size="lg" className="w-full sm:w-auto">
                  Submit a Support Request
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </section>
    </main>
  );
}
