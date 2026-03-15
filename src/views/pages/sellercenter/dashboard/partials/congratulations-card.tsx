'use client'

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Sparkles } from "lucide-react"
import { useTranslation } from "react-i18next";


export function CongratulationsCard() {
  const { t } = useTranslation();

  return (
    <Card className="relative overflow-hidden bg-gradient-to-br from-muted/50 to-muted/30">
      <CardContent className="p-6">
        {/* Decorative confetti dots */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-4 left-8 h-2 w-2 rounded-full bg-blue-400/40" />
          <div className="absolute top-12 right-12 h-1.5 w-1.5 rounded-full bg-orange-400/40" />
          <div className="absolute top-20 left-16 h-1 w-1 rounded-full bg-green-400/40" />
          <div className="absolute bottom-16 right-8 h-2 w-2 rounded-full bg-purple-400/40" />
          <div className="absolute bottom-8 left-12 h-1.5 w-1.5 rounded-full bg-pink-400/40" />
          <div className="absolute top-16 right-20 h-1 w-1 rounded-full bg-yellow-400/40" />
        </div>

        <div className="relative space-y-4">
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-semibold text-balance">
              {t('sellercenter.common.congratulations', { name: 'Toby' })}
            </h3>
            <Sparkles className="h-5 w-5 text-orange-500" />
          </div>

          <p className="text-sm text-muted-foreground">
            {t('sellercenter.common.bestSeller')}
          </p>

          <div className="space-y-1">
            <p className="text-3xl font-bold">$15,231.89</p>
            <p className="text-sm font-medium text-success">+65% from last month</p>
          </div>

          <Button variant="outline" size="sm" className="mt-2 bg-transparent">
            {t('sellercenter.common.viewSales')}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
