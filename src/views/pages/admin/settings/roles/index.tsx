'use client';

import { useState, useEffect, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Icon } from '@iconify/react/dist/iconify.js';
import { toastify } from '@/components/ToastNotification';
import { 
  getAdminRoles, 
  getAllPermissions, 
  updateRole, 
  deleteRole,
  getRolePermissions 
} from '@/services/admin-role';
import { TAdminRole, TAdminPermission } from '@/types/admin/role';
import { Plus, Trash2, Edit, Save, Shield, ShieldCheck, Check } from 'lucide-react';
import { RoleModal } from './role-modal';
import AlertConfirm from '@/components/AlertConfirm';
import { Skeleton } from '@/components/ui/skeleton';

export default function RoleSettingsPage() {
  const [roles, setRoles] = useState<TAdminRole[]>([]);
  const [permissions, setPermissions] = useState<TAdminPermission[]>([]);
  const [selectedRole, setSelectedRole] = useState<TAdminRole | null>(null);
  const [selectedPermissionIds, setSelectedPermissionIds] = useState<number[]>([]);
  
  const [isLoadingRoles, setIsLoadingRoles] = useState(true);
  const [isLoadingPermissions, setIsLoadingPermissions] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalRole, setModalRole] = useState<TAdminRole | null>(null);
  
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [roleToDelete, setRoleToDelete] = useState<TAdminRole | null>(null);

  const isAdminRole = selectedRole?.name === 'ADMIN';

  const fetchRoles = async () => {
    setIsLoadingRoles(true);
    try {
      const res = await getAdminRoles();
      const data = res.data?.data || res.data || [];
      setRoles(data);
      if (data.length > 0 && !selectedRole) {
        setSelectedRole(data[0]);
      }
    } catch (error) {
      toastify.error('Lỗi', 'Không thể lấy danh sách vai trò');
    } finally {
      setIsLoadingRoles(false);
    }
  };

  const fetchPermissions = async () => {
    setIsLoadingPermissions(true);
    try {
      const res = await getAllPermissions();
      const data = res.data?.data || res.data || [];
      setPermissions(data);
    } catch (error) {
      toastify.error('Lỗi', 'Không thể lấy danh sách quyền hạn');
    } finally {
      setIsLoadingPermissions(false);
    }
  };

  useEffect(() => {
    fetchRoles();
    fetchPermissions();
  }, []);

  useEffect(() => {
    if (selectedRole) {
        // Fetch full role details to get current permissions using the new permissions endpoint
        const fetchRoleDetail = async () => {
            try {
                const res = await getRolePermissions(selectedRole.id);
                const roleWithPerms = res.data || res;
                setSelectedPermissionIds(roleWithPerms.permissions?.map((p: any) => p.id) || []);
            } catch (error) {
                console.error(error);
                setSelectedPermissionIds([]);
            }
        };
        fetchRoleDetail();
    }
  }, [selectedRole]);

  const permissionGroups = useMemo(() => {
    const groups: Record<string, TAdminPermission[]> = {};
    permissions.forEach(p => {
      if (!groups[p.module]) {
        groups[p.module] = [];
      }
      groups[p.module].push(p);
    });
    return groups;
  }, [permissions]);

  const togglePermission = (id: number) => {
    if (isAdminRole) return;
    setSelectedPermissionIds(prev => 
      prev.includes(id) ? prev.filter(pId => pId !== id) : [...prev, id]
    );
  };

  const handleSavePermissions = async () => {
    if (!selectedRole || isAdminRole) return;
    
    setIsSaving(true);
    try {
      await updateRole(selectedRole.id, {
        name: selectedRole.name,
        description: selectedRole.description,
        isActive: selectedRole.isActive,
        permissionIds: selectedPermissionIds
      });
      toastify.success('Thành công', 'Cập nhật quyền hạn thành công');
      fetchRoles();
    } catch (error: any) {
      toastify.error('Lỗi', error.message || 'Có lỗi xảy ra khi lưu quyền hạn');
    } finally {
      setIsSaving(false);
    }
  };

  const handleAddRole = () => {
    setModalRole(null);
    setIsModalOpen(true);
  };

  const handleEditRole = (e: React.MouseEvent, role: TAdminRole) => {
    e.stopPropagation();
    if (role.name === 'ADMIN') return;
    setModalRole(role);
    setIsModalOpen(true);
  };

  const handleDeleteClick = (e: React.MouseEvent, role: TAdminRole) => {
    e.stopPropagation();
    if (role.name === 'ADMIN') return;
    setRoleToDelete(role);
    setDeleteConfirmOpen(true);
  };

  const confirmDelete = async () => {
    if (roleToDelete) {
      try {
        await deleteRole(roleToDelete.id);
        toastify.success('Thành công', 'Xóa vai trò thành công');
        if (selectedRole?.id === roleToDelete.id) {
            setSelectedRole(roles.find(r => r.id !== roleToDelete.id) || null);
        }
        fetchRoles();
      } catch (error: any) {
        toastify.error('Lỗi', error.message || 'Không thể xóa vai trò');
      } finally {
        setDeleteConfirmOpen(false);
        setRoleToDelete(null);
      }
    }
  };

  return (
    <div className="container mx-auto p-4 md:p-6 space-y-6 flex flex-col h-[calc(100vh-120px)]">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Icon icon="ph:shield-check" className="text-3xl text-gray-700" />
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
            Phân quyền hệ thống
          </h1>
        </div>
        <Button onClick={handleAddRole}>
          <Plus className="mr-2 h-4 w-4" /> Thêm vai trò
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 flex-1 overflow-hidden">
        {/* Left column: Roles List */}
        <div className="md:col-span-4 lg:col-span-3 flex flex-col overflow-hidden">
          <Card className="flex-1 flex flex-col overflow-hidden shadow-sm">
            <CardHeader className="pb-3 border-b">
              <CardTitle className="text-lg">Danh sách vai trò</CardTitle>
              <CardDescription>Chọn một vai trò để quản lý quyền</CardDescription>
            </CardHeader>
            <CardContent className="p-0 flex-1 overflow-hidden">
              <ScrollArea className="h-full">
                <div className="p-2 space-y-1">
                  {isLoadingRoles ? (
                    Array(5).fill(0).map((_, i) => (
                      <div key={i} className="p-4 space-y-2">
                         <Skeleton className="h-4 w-3/4" />
                         <Skeleton className="h-3 w-full" />
                      </div>
                    ))
                  ) : roles.map((role) => (
                    <div
                      key={role.id}
                      onClick={() => setSelectedRole(role)}
                      className={`
                        p-4 rounded-lg cursor-pointer transition-all border
                        ${selectedRole?.id === role.id 
                          ? 'bg-primary/5 border-primary ring-1 ring-primary/20' 
                          : 'border-transparent hover:bg-gray-50'
                        }
                      `}
                    >
                      <div className="flex justify-between items-start mb-1">
                        <div className="flex items-center gap-2">
                           <span className="font-bold text-sm">{role.name}</span>
                           {role.name === 'ADMIN' && <Badge variant="secondary" className="bg-amber-100 text-amber-700 hover:bg-amber-100 border-none px-1 h-4 text-[10px]"><Shield className="w-2.5 h-2.5 mr-0.5" /> Core</Badge>}
                        </div>
                        <div className="flex gap-1">
                           {role.name !== 'ADMIN' && (
                             <>
                                <Button 
                                    variant="ghost" 
                                    size="icon" 
                                    className="h-7 w-7 text-gray-400 hover:text-primary"
                                    onClick={(e) => handleEditRole(e, role)}
                                >
                                    <Edit className="w-3.5 h-3.5" />
                                </Button>
                                <Button 
                                    variant="ghost" 
                                    size="icon" 
                                    className="h-7 w-7 text-gray-400 hover:text-red-500"
                                    onClick={(e) => handleDeleteClick(e, role)}
                                >
                                    <Trash2 className="w-3.5 h-3.5" />
                                </Button>
                             </>
                           )}
                        </div>
                      </div>
                      <p className="text-xs text-gray-500 line-clamp-2">{role.description}</p>
                      <div className="mt-3 flex items-center justify-between">
                         <Badge variant={role.isActive ? 'outline' : 'secondary'} className={role.isActive ? 'text-green-600 border-green-200 bg-green-50' : ''}>
                            {role.isActive ? 'Hoạt động' : 'Đã khóa'}
                         </Badge>
                         {selectedRole?.id === role.id && <div className="w-1.5 h-1.5 rounded-full bg-primary" />}
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </div>

        {/* Right column: Permissions management */}
        <div className="md:col-span-8 lg:col-span-9 flex flex-col overflow-hidden">
          <Card className="flex-1 flex flex-col overflow-hidden shadow-sm border-2">
            <CardHeader className="pb-3 border-b flex flex-row items-center justify-between sticky top-0 bg-white z-10">
              <div>
                <CardTitle className="text-xl flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-primary" />
                  Quyền hạn cho: <span className="text-primary">{selectedRole?.name || '...'}</span>
                  {isAdminRole && <Badge variant="destructive" className="ml-2">Không thể chỉnh sửa</Badge>}
                </CardTitle>
                <CardDescription>
                  Gán hoặc gỡ các quyền cụ thể cho vai trò này
                </CardDescription>
              </div>
              <Button 
                onClick={handleSavePermissions} 
                disabled={isSaving || isAdminRole || !selectedRole}
                className="shadow-md"
              >
                {isSaving ? 'Đang lưu...' : (
                   <><Save className="mr-2 h-4 w-4" /> Lưu thay đổi</>
                )}
              </Button>
            </CardHeader>
            <CardContent className="p-0 flex-1 overflow-hidden">
              <ScrollArea className="h-full bg-gray-50/30">
                <div className="p-6">
                  {isLoadingPermissions ? (
                     <div className="space-y-6">
                        {Array(3).fill(0).map((_, i) => (
                           <div key={i} className="space-y-4">
                              <Skeleton className="h-6 w-1/4" />
                              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                                 {Array(4).fill(0).map((_, j) => (
                                    <Skeleton key={j} className="h-16 w-full" />
                                 ))}
                              </div>
                           </div>
                        ))}
                     </div>
                  ) : Object.keys(permissionGroups).length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 text-gray-500">
                        <Icon icon="ph:shield-warning" className="text-5xl mb-4 opacity-20" />
                        <p>Không có quyền hạn nào trong hệ thống</p>
                    </div>
                  ) : (
                    <div className="space-y-10">
                      {Object.entries(permissionGroups).map(([module, perms]) => (
                        <div key={module} className="space-y-4">
                           <div className="flex items-center gap-2">
                              <Badge className="bg-gray-800 uppercase tracking-wider text-[10px] py-0.5">{module}</Badge>
                              <div className="h-px flex-1 bg-gray-200" />
                           </div>
                          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
                            {perms.map((p) => {
                              const isSelected = selectedPermissionIds.includes(p.id);
                              return (
                                <div
                                  key={p.id}
                                  onClick={() => togglePermission(p.id)}
                                  className={`
                                    flex items-start gap-4 p-4 rounded-xl border-2 transition-all cursor-pointer bg-white
                                    ${isSelected 
                                      ? 'border-primary ring-2 ring-primary/5 shadow-sm' 
                                      : 'border-transparent hover:border-gray-200 hover:shadow-sm'
                                    }
                                    ${isAdminRole ? 'opacity-80' : ''}
                                  `}
                                >
                                  <div className="mt-1">
                                    <Checkbox
                                      checked={isSelected}
                                      onCheckedChange={() => togglePermission(p.id)}
                                      disabled={isAdminRole}
                                      id={`permission-${p.id}`}
                                      className="data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                                    />
                                  </div>
                                  <div className="flex-1 space-y-1">
                                    <div className="flex items-center justify-between">
                                       <label
                                          htmlFor={`permission-${p.id}`}
                                          className="text-sm font-bold leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                                       >
                                          {p.name}
                                       </label>
                                       {isSelected && <Check className="w-3.5 h-3.5 text-primary" />}
                                    </div>
                                    <p className="text-xs text-muted-foreground line-clamp-1 italic">
                                      {p.description}
                                    </p>
                                    <div className="pt-2 flex flex-wrap gap-1.5">
                                       <Badge variant="outline" className={`text-[10px] font-mono px-1.5 py-0 h-5 
                                          ${p.method === 'GET' ? 'text-blue-600 border-blue-200 bg-blue-50' : 
                                            p.method === 'POST' ? 'text-green-600 border-green-200 bg-green-50' : 
                                            p.method === 'DELETE' ? 'text-red-600 border-red-200 bg-red-50' : 
                                            'text-amber-600 border-amber-200 bg-amber-50'}
                                       `}>
                                          {p.method}
                                       </Badge>
                                       <code className="text-[10px] text-gray-400 bg-gray-100 px-1 rounded truncate max-w-[150px]">
                                          {p.path}
                                       </code>
                                    </div>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </div>
      </div>

      <RoleModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSuccess={fetchRoles} 
        role={modalRole}
      />

      <AlertConfirm
        open={deleteConfirmOpen}
        title="Xác nhận xóa vai trò"
        description={`Bạn có chắc muốn xóa vai trò "${roleToDelete?.name}"? Các người dùng đang thuộc vai trò này sẽ bị ảnh hưởng.`}
        type="error"
        onConfirm={confirmDelete}
        onClose={() => setDeleteConfirmOpen(false)}
        onCancel={() => setDeleteConfirmOpen(false)}
      />
    </div>
  );
}
