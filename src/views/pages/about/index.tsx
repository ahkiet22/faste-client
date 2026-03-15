"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, Users, Target, Zap, Heart } from "lucide-react"
import Image from "next/image"
import { useTranslation } from "react-i18next"


import { useMemo } from "react";

export default function AboutPage() {
  const { t } = useTranslation();
  const [hoveredMember, setHoveredMember] = useState<number | null>(null)

  // Mock team members data
  const teamMembers = useMemo(() => [
    {
      id: 1,
      name: "Sarah Johnson",
      role: t("about.teamRoles.ceo"),
      bio: t("about.teamBios.ceo"),
      image: "/professional-woman-ceo.jpg",
    },
    {
      id: 2,
      name: "Michael Chen",
      role: t("about.teamRoles.cto"),
      bio: t("about.teamBios.cto"),
      image: "/professional-man-developer.jpg",
    },
    {
      id: 3,
      name: "Emily Rodriguez",
      role: t("about.teamRoles.design"),
      bio: t("about.teamBios.design"),
      image: "/professional-woman-designer.jpg",
    },
    {
      id: 4,
      name: "David Kim",
      role: t("about.teamRoles.ops"),
      bio: t("about.teamBios.ops"),
      image: "/professional-man-operations.jpg",
    },
  ], [t]);

  // Mock company values
  const values = useMemo(() => [
    {
      icon: Target,
      title: t("about.values.customerFirst"),
      description: t("about.values.customerFirstDesc"),
    },
    {
      icon: Zap,
      title: t("about.values.innovation"),
      description: t("about.values.innovationDesc"),
    },
    {
      icon: Heart,
      title: t("about.values.integrity"),
      description: t("about.values.integrityDesc"),
    },
    {
      icon: Users,
      title: t("about.values.community"),
      description: t("about.values.communityDesc"),
    },
  ], [t]);

  return (
    <main className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-primary/10 to-background py-20 md:py-32">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <Badge className="mb-4 inline-block" variant="secondary">
              {t("about.badge")}
            </Badge>
            <h1 className="mb-6 text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl text-balance">
              {t("about.heroTitle")}
            </h1>
            <p className="mx-auto mb-8 max-w-2xl text-lg text-muted-foreground md:text-xl">
              {t("about.heroDesc")}
            </p>
            <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
              <Button size="lg" asChild>
                <Link href="/contact">{t("about.getInTouch")}</Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/blog">{t("about.readBlog")}</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision Section */}
      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 md:grid-cols-2">
            {/* Mission */}
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">{t("about.missionTitle")}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">{t("about.missionDesc1")}</p>
                <p className="text-muted-foreground">{t("about.missionDesc2")}</p>
              </CardContent>
            </Card>

            {/* Vision */}
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">{t("about.visionTitle")}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">{t("about.visionDesc1")}</p>
                <p className="text-muted-foreground">{t("about.visionDesc2")}</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Company Values Section */}
      <section className="bg-muted/50 py-16 md:py-24">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold md:text-4xl">{t("about.coreValuesTitle")}</h2>
            <p className="mx-auto max-w-2xl text-muted-foreground">
              {t("about.coreValuesDesc")}
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {values.map((value) => {
              const Icon = value.icon
              return (
                <Card key={value.title} className="flex flex-col">
                  <CardHeader>
                    <div className="mb-2 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                      <Icon className="h-6 w-6 text-primary" />
                    </div>
                    <CardTitle className="text-lg">{value.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="flex-1">
                    <p className="text-sm text-muted-foreground">{value.description}</p>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      {/* Team Section */}
      {/* <section className="py-16 md:py-24">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold md:text-4xl">{t("about.teamTitle")}</h2>
            <p className="mx-auto max-w-2xl text-muted-foreground">
              {t("about.teamDesc")}
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {teamMembers.map((member) => (
              <Card
                key={member.id}
                className="overflow-hidden transition-all duration-300 hover:shadow-lg"
                onMouseEnter={() => setHoveredMember(member.id)}
                onMouseLeave={() => setHoveredMember(null)}
              >
                <div className="relative h-64 overflow-hidden bg-muted">
                  <Image
                    width={100}
                    height={100}
                    src={member.image || "/placeholder.svg"}
                    alt={member.name}
                    className="h-full w-full object-cover transition-transform duration-300"
                    style={{
                      transform: hoveredMember === member.id ? "scale(1.05)" : "scale(1)",
                    }}
                  />
                </div>
                <CardHeader>
                  <CardTitle className="text-lg">{member.name}</CardTitle>
                  <CardDescription className="font-medium text-primary">{member.role}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{member.bio}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section> */}

      {/* Stats Section */}
      <section className="bg-primary text-primary-foreground py-16 md:py-24">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 md:grid-cols-4">
            {[
              { label: t("about.stats.activeSellers"), value: "50K+" },
              { label: t("about.stats.productsListed"), value: "2M+" },
              { label: t("about.stats.happyCustomers"), value: "500K+" },
              { label: t("about.stats.countriesServed"), value: "45+" },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="mb-2 text-4xl font-bold md:text-5xl">{stat.value}</div>
                <p className="text-sm opacity-90">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="mb-4 text-3xl font-bold md:text-4xl">{t("about.ctaTitle")}</h2>
          <p className="mb-8 text-lg text-muted-foreground">
            {t("about.ctaDesc")}
          </p>
          <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
            <Button size="lg" asChild>
              <Link href="/shop">
                {t("about.exploreShops")} <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/contact">{t("navigation.contact")}</Link>
            </Button>
          </div>
        </div>
      </section>
    </main>
  )
}
