'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plus, MapPinOff } from 'lucide-react';
import { AddressModal } from './partials/address-modal';
import addressShipService from '@/services/address-ship.service';
import { AddressShipType } from '@/types/address-ship';
import AlertConfirm from '@/components/AlertConfirm';
import { Skeleton } from '@/components/ui/skeleton';
import { useTranslation } from 'react-i18next';

export default function AddressPage() {
  const { t } = useTranslation();
  const [addresses, setAddresses] = useState<AddressShipType[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingAddress, setEditingAddress] = useState<AddressShipType | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(true);

  const [addressToDelete, setAddressToDelete] = useState<number | null>(null);
  const [isAlertOpen, setIsAlertOpen] = useState(false);

  const fetchAddresses = async () => {
    try {
      setIsLoading(true);
      const data = await addressShipService.getAllAddressShips();
      setAddresses(data.data.data); // data is expected to be AddressShipType[] or { data: AddressShipType[] }
    } catch (error) {
      console.error('Error fetching addresses:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAddresses();
  }, []);

  const handleSetDefault = async (id: number) => {
    try {
      await addressShipService.updateAddressShip(id, { isDefault: true });
      fetchAddresses();
    } catch (error) {
      console.error('Error setting default address:', error);
    }
  };

  const handleDeleteClick = (id: number) => {
    setAddressToDelete(id);
    setIsAlertOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!addressToDelete) return;
    try {
      await addressShipService.deleteAddressShip(addressToDelete);
      fetchAddresses();
    } catch (error) {
      console.error('Error deleting address:', error);
    } finally {
      setIsAlertOpen(false);
      setAddressToDelete(null);
    }
  };

  const getTags = (address: AddressShipType) => {
    const tags = [];
    if (address.isDefault) tags.push(t('address.default'));
    if (address.isDeliveryAddress) tags.push(t('address.deliveryAddress'));
    return tags;
  };

  const getTagColor = (tag: string) => {
    switch (tag) {
      case t('address.default'):
        return 'bg-red-100 text-red-700 border-red-200';
      case t('address.deliveryAddress'):
        return 'bg-blue-100 text-blue-700 border-blue-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <h1 className="text-xl font-medium text-foreground">{t('address.myAddresses')}</h1>
        <Button
          className="bg-orange-500 hover:bg-orange-600 text-white"
          onClick={() => {
            setEditingAddress(undefined);
            setShowAddForm(true);
          }}
        >
          <Plus className="w-4 h-4 mr-2" />
          {t('address.addNew')}
        </Button>
      </div>

      {/* Address Section */}
      <div className="space-y-4">
        <h2 className="text-lg font-medium text-foreground">{t('address.address')}</h2>

        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="p-4 border border-border">
                <div className="flex flex-col md:flex-row justify-between items-start gap-4">
                  <div className="flex-1 space-y-3 w-full">
                    <div className="flex items-center gap-3">
                      <Skeleton className="h-5 w-32" />
                      <Skeleton className="h-5 w-32" />
                      <div className="flex gap-2">
                        <Skeleton className="h-5 w-16" />
                        <Skeleton className="h-5 w-24" />
                      </div>
                    </div>
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                  </div>
                  <div className="flex flex-col items-end gap-3 w-full md:w-auto">
                    <div className="flex gap-2">
                      <Skeleton className="h-5 w-16" />
                      <Skeleton className="h-5 w-10" />
                    </div>
                    <Skeleton className="h-8 w-32" />
                  </div>
                </div>
              </Card>
            ))}
          </div>
        ) : addresses?.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center animate-in fade-in zoom-in duration-500">
            <div className="bg-orange-100 p-5 rounded-full mb-5 shadow-sm transform hover:scale-110 transition-transform cursor-pointer">
              <MapPinOff className="w-12 h-12 text-orange-500" />
            </div>
            <h3 className="text-xl font-medium text-foreground mb-2">{t('address.emptyTitle')}</h3>
            <p className="text-muted-foreground mb-6 max-w-sm">
              {t('address.emptyDescription')}
            </p>
            <Button 
              className="bg-orange-500 hover:bg-orange-600 text-white shadow-md hover:shadow-lg transition-all" 
              onClick={() => {
                setEditingAddress(undefined);
                setShowAddForm(true);
              }}
            >
              {t('address.addNow')}
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {addresses?.map((address) => (
              <Card key={address.id} className="p-4 border border-border">
                <div className="flex flex-col md:flex-row justify-between items-start gap-4">
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-3">
                      <span className="font-medium text-foreground">
                        {address.name}
                      </span>
                      <span className="text-muted-foreground border-l pl-3 ml-1">
                        {address.phone}
                      </span>
                      <div className="flex flex-wrap gap-1">
                        {getTags(address).map((tag, index) => (
                          <Badge
                            key={index}
                            variant="outline"
                            className={`text-xs px-2 py-1 ${getTagColor(tag)}`}
                          >
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div className="text-muted-foreground text-sm whitespace-pre-line">
                      {address.address}
                      {address.divisionPath && (
                        <span>
                          {'\n'}
                          {Object.values(address.divisionPath).filter(Boolean).join(', ')}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-row md:flex-col items-center md:items-end gap-2 pr-2 md:pr-0 border-t md:border-t-0 pt-2 md:pt-0 w-full md:w-auto mt-2 md:mt-0">
                    <Button
                      variant="link"
                      className="text-blue-600 hover:text-blue-700 p-0 h-auto font-normal"
                      onClick={() => {
                        setEditingAddress(address);
                        setShowAddForm(true);
                      }}
                    >
                      {t('address.update')}
                    </Button>
                    <Button
                      variant="link"
                      className="text-blue-600 hover:text-blue-700 p-0 h-auto font-normal"
                      onClick={() => handleDeleteClick(address.id)}
                    >
                      {t('address.delete')}
                    </Button>
                    {!address.isDefault && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-muted-foreground border-border hover:bg-muted bg-transparent mt-2 md:mt-4"
                        onClick={() => handleSetDefault(address.id)}
                      >
                        {t('address.setDefault')}
                      </Button>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      <AddressModal
        isOpen={showAddForm}
        initialData={editingAddress}
        onClose={() => {
          setShowAddForm(false);
          setEditingAddress(undefined);
        }}
        onSuccess={() => {
          setShowAddForm(false);
          setEditingAddress(undefined);
          fetchAddresses(); // Refresh list after adding/updating
        }}
      />

      <AlertConfirm
        open={isAlertOpen}
        title={t('address.deleteConfirmTitle')}
        description={t('address.deleteConfirmDescription')}
        type="warning"
        onConfirm={handleConfirmDelete}
        onClose={() => setIsAlertOpen(false)}
        onCancel={() => setIsAlertOpen(false)}
      />
    </div>
  );
}
