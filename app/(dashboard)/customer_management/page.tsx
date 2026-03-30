"use client";
import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import {Check,ChevronsUpDown,Edit2,History,Loader2,MinusCircle,MoreVertical,PlusCircle,Trash} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useCustomers } from "@/hooks/useCustomers";
import { useCreateCustomer } from "@/hooks/useCreateCustomer";
import { useDeleteCustomer } from "@/hooks/useDeleteCustomer";
import { useUpdateCustomer } from "@/hooks/useUpdateCustomer";
import { useRedeemPoints } from "@/hooks/useRedeemPoints";
import { useEarnPoints } from "@/hooks/useEarnPoints";
import { useCustomerPointHistory } from "@/hooks/useCustomerPointHistory";
import { Customer, CreateCustomerRequest } from "@/types/customer.type";
import {Popover,PopoverContent,PopoverTrigger} from "@/components/ui/popover";
import {Command,CommandEmpty,CommandGroup,CommandInput,CommandItem} from "@/components/ui/command";
import {Dialog,DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger} from "@/components/ui/dialog";
import {Form,FormControl,FormField,FormItem,FormLabel,FormMessage} from "@/components/ui/form";
import { cn } from "@/lib/utils";
import { ProvinceOption } from "@/types/province.type";
import { toast } from "react-toastify";
import { useProvinces } from "@/hooks/useProvinces ";
import { useQueryClient } from "@tanstack/react-query";
import {Tooltip,TooltipContent,TooltipProvider,TooltipTrigger} from "@/components/ui/tooltip";
const createEmptyFilters = () => ({ phone: "", fullName: "", province: "" });
const createEmptyCustomerForm = (): CreateCustomerRequest => ({fullName: "",phone: "",email: "",province: "",referralCode: ""});
const CustomerManagement = () => {
  const [formFilters, setFormFilters] = useState(createEmptyFilters());
  const [appliedFilters, setAppliedFilters] = useState(createEmptyFilters());
  const [page, setPage] = useState(0);
  const [shouldLoadProvincesForCreate, setShouldLoadProvincesForCreate] = useState(false);
  const [shouldLoadProvincesForEdit, setShouldLoadProvincesForEdit] = useState(false);
  const [shouldLoadProvincesForFilter, setShouldLoadProvincesForFilter] = useState(false);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isRedeemOpen, setIsRedeemOpen] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  const [redeemCustomer, setRedeemCustomer] = useState<Customer | null>(null);
  const [historyCustomer, setHistoryCustomer] = useState<Customer | null>(null);
  const [redeemMode, setRedeemMode] = useState<"earn" | "redeem">("redeem");
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [isApplyingFilters, setIsApplyingFilters] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [customerToDelete, setCustomerToDelete] = useState<Customer | null>(null);
  const [isExporting, setIsExporting] = useState(false);
  // CREATE
  const {data: provincesCreate = [],isLoading: isLoadingCreate,isFetching: isFetchingCreate} = useProvinces({enabled: shouldLoadProvincesForCreate, context: "create"});
  // EDIT
  const {data: provincesEdit = [],isLoading: isLoadingEdit,isFetching: isFetchingEdit} = useProvinces({ enabled: shouldLoadProvincesForEdit, context: "edit" });

  // FILTER
  const {
    data: provincesFilter = [],
    isLoading: isLoadingFilter,
    isFetching: isFetchingFilter,
  } = useProvinces({
    enabled: shouldLoadProvincesForFilter,
    context: "filter",
  });
  const size = 4;
  const queryClient = useQueryClient();
  const [historyPage, setHistoryPage] = useState(0);
  const historyPageSize = 4;

  // Use first available data source (all return same data from API)
  const provincesData =
    provincesCreate.length > 0
      ? provincesCreate
      : provincesEdit.length > 0
        ? provincesEdit
        : provincesFilter;
  const provinceOptions = useMemo<ProvinceOption[]>(() => {
    if (!Array.isArray(provincesData)) return [];
    return provincesData
      .map((province: unknown) => {
        if (typeof province === "string") {
          return { label: province, value: province } as ProvinceOption;
        }
        if (province && typeof province === "object") {
          const record = province as Record<string, unknown>;
          const label =
            (record.name as string | undefined) ??
            (record.province_name as string | undefined) ??
            (record.fullName as string | undefined) ??
            (record.label as string | undefined) ??
            "";
          const value = label || String(record.code ?? "");
          if (!label && !value) return null;
          return { label, value } as ProvinceOption;
        }

        return null;
      })
      .filter(Boolean) as ProvinceOption[];
  }, [provincesCreate, provincesEdit, provincesFilter]);
  const queryParams = useMemo(
    () => ({
      page,
      size,
      phone: appliedFilters.phone || undefined,
      fullName: appliedFilters.fullName || undefined,
      province: appliedFilters.province || undefined,
    }),
    [appliedFilters, page],
  );
  const { data, isLoading, isFetching, refetch } = useCustomers(queryParams);
  const customers = data?.data ?? [];
  const totalPages = data?.totalPages ?? 1;
  const totalItems = data?.totalItems ?? customers.length;
  const currentPage = data?.currentPage ?? page;
  const normalizedCurrentPage = Math.max(currentPage, 0) + 1;
  type CreateCustomerFormValues = CreateCustomerRequest;
  const createCustomerForm = useForm<CreateCustomerFormValues>({
    defaultValues: createEmptyCustomerForm(),
  });
  const editCustomerForm = useForm<CreateCustomerFormValues>({
    defaultValues: createEmptyCustomerForm(),
  });
  type RedeemPointsFormValues = { points: number; reason: string };
  const redeemPointsForm = useForm<RedeemPointsFormValues>({
    defaultValues: { points: 0, reason: "" },
  });
  const { mutateAsync: createCustomer, isPending: isCreating } =
    useCreateCustomer();
  const { mutateAsync: updateCustomer, isPending: isUpdating } =
    useUpdateCustomer();
  const { mutateAsync: redeemPoints, isPending: isRedeeming } =
    useRedeemPoints();
  const { mutateAsync: earnPoints, isPending: isEarning } = useEarnPoints();
  const { mutateAsync: deleteCustomer, isPending: isDeleting } =
    useDeleteCustomer();
  const {
    data: historyData,
    isLoading: isHistoryLoading,
    isFetching: isHistoryFetching,
    refetch: refetchHistory,
  } = useCustomerPointHistory({
    customerId: historyCustomer?.id,
    page: historyPage,
    size: historyPageSize,
    enabled: isHistoryOpen,
  });

  const refreshHistoryForCustomer = (customerId?: number) => {
    if (!customerId) return;

    queryClient.invalidateQueries({
      predicate: (query) => {
        const [key, id] = query.queryKey;
        return key === "customer-point-history" && id === customerId;
      },
    });

    if (isHistoryOpen && historyCustomer?.id === customerId) {
      setHistoryPage(0);
      refetchHistory();
    }
  };
  const handleApplyFilters = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const nextFilters = { ...formFilters };
    const filtersChanged =
      nextFilters.phone !== appliedFilters.phone ||
      nextFilters.fullName !== appliedFilters.fullName ||
      nextFilters.province !== appliedFilters.province;
    const shouldTriggerRefetch = filtersChanged || page !== 0;
    setIsApplyingFilters(true);
    setAppliedFilters(nextFilters);
    setPage(0);

    if (!shouldTriggerRefetch) {
      setIsApplyingFilters(false);
    }
  };

  const handleResetFilters = () => {
    const nextFilters = createEmptyFilters();
    setFormFilters(nextFilters);
    setAppliedFilters(nextFilters);
    setPage(0);
  };

  const handleExportCustomers = () => {
    if (!customers?.length) {
      toast.info("Không có dữ liệu để xuất.");
      return;
    }

    try {
      setIsExporting(true);
      const headers = [
        "Mã khách hàng",
        "Họ và tên",
        "Số điện thoại",
        "Email",
        "Điểm tích lũy",
        "Tỉnh / Thành",
        "Mã giới thiệu",
      ];

      const rows = customers.map((customer) => [
        customer.customerCode ?? "",
        customer.fullName ?? "",
        customer.phone ?? "",
        customer.email ?? "",
        customer.totalPoints ?? 0,
        customer.province ?? "",
        customer.referralCode ?? "",
      ]);

      const csvContent = [headers, ...rows]
        .map((row) =>
          row
            .map((value) => {
              const cell = String(value ?? "");
              const escaped = cell.replace(/"/g, '""');
              return `"${escaped}"`;
            })
            .join(","),
        )
        .join("\r\n");

      const blob = new Blob(["\ufeff" + csvContent], {
        type: "text/csv;charset=utf-8;",
      });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `customers_${new Date().toISOString().slice(0, 10)}.csv`;
      link.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Export customers failed", error);
      toast.error("Xuất Excel thất bại. Vui lòng thử lại.");
    } finally {
      setIsExporting(false);
    }
  };

  const openEditDialog = (customer: Customer) => {
    setEditingCustomer(customer);
    setIsEditOpen(true);
    setShouldLoadProvincesForEdit(true);
    editCustomerForm.reset({
      fullName: customer.fullName || "",
      phone: customer.phone || "",
      email: customer.email || "",
      province: customer.province || "",
      referralCode: customer.referralCode || "",
    });
  };

  const closeEditDialog = () => {
    setIsEditOpen(false);
    setEditingCustomer(null);
    setShouldLoadProvincesForEdit(false);
    editCustomerForm.reset(createEmptyCustomerForm());
  };

  const openRedeemDialog = (customer: Customer) => {
    setRedeemCustomer(customer);
    setRedeemMode("redeem");
    setIsRedeemOpen(true);
    redeemPointsForm.reset({ points: 0, reason: "" });
  };

  const openEarnDialog = (customer: Customer) => {
    setRedeemCustomer(customer);
    setRedeemMode("earn");
    setIsRedeemOpen(true);
    redeemPointsForm.reset({ points: 0, reason: "" });
  };

  const openHistoryDialog = (customer: Customer) => {
    setHistoryCustomer(customer);
    setHistoryPage(0);
    setIsHistoryOpen(true);
    refetchHistory();
  };

  const closeRedeemDialog = () => {
    setIsRedeemOpen(false);
    setRedeemCustomer(null);
    redeemPointsForm.reset({ points: 0, reason: "" });
  };

  const closeHistoryDialog = () => {
    setIsHistoryOpen(false);
    setHistoryCustomer(null);
    setHistoryPage(0);
  };

  const closeDeleteDialog = () => {
    setIsDeleteDialogOpen(false);
    setCustomerToDelete(null);
  };

  const handleCreateCustomer = createCustomerForm.handleSubmit(
    async (values) => {
      try {
        await createCustomer(
          {
            ...values,
            email: values.email || undefined,
            province: values.province || undefined,
            referralCode: values.referralCode || undefined,
          },
          {
            onSuccess: (data) => {
              toast.success(data.message || "Tạo khách hàng thành công!");
              queryClient.invalidateQueries({ queryKey: ["customers"] });
            },
          },
        );

        setIsCreateOpen(false);
        createCustomerForm.reset(createEmptyCustomerForm());
        refetch();
      } catch (error: any) {
        toast.error(
          error.response?.data?.message || "Tạo khách hàng thất bại!",
        );
      }
    },
  );

  const handleUpdateCustomer = editCustomerForm.handleSubmit(async (values) => {
    if (!editingCustomer) return;
    try {
      await updateCustomer(
        {
          id: editingCustomer.id,
          payload: {
            ...values,
            email: values.email || undefined,
            province: values.province || undefined,
            referralCode: values.referralCode || null,
          },
        },
        {
          onSuccess: (data) => {
            toast.success(data.message || "Cập nhật khách hàng thành công!");
            queryClient.invalidateQueries({ queryKey: ["customers"] });
          },
        },
      );

      closeEditDialog();
      refetch();
    } catch (error: any) {
      toast.error(
        error.response?.data?.message || "Cập nhật khách hàng thất bại!",
      );
    }
  });

  const handleDeleteCustomer = (customer: Customer) => {
    setCustomerToDelete(customer);
    setIsDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!customerToDelete) return;
    try {
      setDeletingId(customerToDelete.id);
      await deleteCustomer(customerToDelete.id, {
        onSuccess: (data) => {
          toast.success(data.message || "Xoá khách hàng thành công!");
          queryClient.invalidateQueries({ queryKey: ["customers"] });
        },
      });
      refetch();
      closeDeleteDialog();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Xoá khách hàng thất bại!");
    } finally {
      setDeletingId(null);
    }
  };

  const handleRedeemPoints = redeemPointsForm.handleSubmit(async (values) => {
    if (!redeemCustomer) return;
    try {
      const payload = {
        id: redeemCustomer.id,
        payload: { points: Number(values.points) || 0, reason: values.reason },
      };

      if (redeemMode === "earn") {
        await earnPoints(payload, {
          onSuccess: (data) => {
            toast.success(data.message || "Cộng điểm thành công!");
            queryClient.invalidateQueries({ queryKey: ["customers"] });
            refreshHistoryForCustomer(redeemCustomer.id);
          },
        });
      } else {
        await redeemPoints(payload, {
          onSuccess: (data) => {
            toast.success(data.message || "Trừ điểm thành công!");
            queryClient.invalidateQueries({ queryKey: ["customers"] });
            refreshHistoryForCustomer(redeemCustomer.id);
          },
        });
      }
      closeRedeemDialog();
      refetch();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Cập nhật điểm thất bại!");
    }
  });

  const handlePageChange = (direction: -1 | 1) => {
    setPage((prev) => {
      const next = prev + direction;
      if (next < 0) return 0;
      const maxPageIndex = Math.max((totalPages || 1) - 1, 0);
      return next > maxPageIndex ? maxPageIndex : next;
    });
  };

  useEffect(() => {
    if (!isFetching) {
      setIsApplyingFilters(false);
    }
  }, [isFetching]);

  const renderTableBody = () => {
    if (isLoading) {
      return (
        <tr>
          <td colSpan={7} className="px-6 py-10 text-center text-slate-500">
            <Loader2 className="mx-auto mb-2 h-5 w-5 animate-spin text-sky-500" />
            Đang tải dữ liệu khách hàng...
          </td>
        </tr>
      );
    }

    if (!customers.length) {
      return (
        <tr>
          <td colSpan={7} className="px-6 py-10 text-center text-slate-500">
            Không tìm thấy khách hàng phù hợp với bộ lọc.
          </td>
        </tr>
      );
    }

    return customers.map((customer: Customer) => (
      <tr
        key={customer.customerCode}
        className="hover:bg-slate-50/60 transition-colors"
      >
        {/* Mã khách hàng */}
        <td className="px-3 md:px-4 py-3 text-slate-700 text-center whitespace-nowrap">
          {customer.customerCode || "—"}
        </td>

        {/* Khách hàng (Tên + SĐT) */}
        <td className="px-3 md:px-4 py-3 text-slate-900">
          <div className="max-w-[200px] md:max-w-[240px] text-left">
            <div
              className="block w-full truncate font-medium"
              title={customer.fullName}
            >
              {customer.fullName || "—"}
            </div>
            <p className="block w-full truncate text-xs text-slate-400">
              {customer.phone || "—"}
            </p>
          </div>
        </td>

        {/* Email - FIX CHÍNH Ở ĐÂY */}
        <td className="px-3 md:px-4 py-3 text-slate-700">
          <div className="truncate max-w-[220px] md:max-w-[260px]" title={customer.email || ""}>
            {customer.email || "—"}
          </div>
        </td>

        {/* Điểm tích lũy */}
        <td className="px-3 md:px-4 py-3 text-slate-700 text-center whitespace-nowrap">
          {(customer.totalPoints ?? 0).toLocaleString("vi-VN")}
        </td>

        {/* Tỉnh / Thành phố */}
        <td className="px-3 md:px-4 py-3">
          <span className="inline-block max-w-[150px] rounded-full bg-sky-50 px-3 py-1 text-xs text-sky-600 break-words whitespace-normal">
            {customer.province || "N/A"}
          </span>
        </td>

        {/* Mã giới thiệu */}
        <td className="px-3 md:px-4 py-3 text-slate-700 text-center whitespace-nowrap">
          {customer.referralCode || "Chưa có"}
        </td>

        {/* Hành động - Popover */}
        <td className="px-3 md:px-4 py-3 text-center">
          <Popover>
            <PopoverTrigger asChild>
              <div className="flex justify-center">
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  className="h-9 w-9 cursor-pointer border-slate-200 text-slate-700 hover:bg-slate-50"
                  aria-label="Mở hành động"
                >
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </div>
            </PopoverTrigger>

            {/* <PopoverContent align="end" className="w-44 p-2">
              <div className="flex flex-col gap-1">
                <Button
                  type="button"
                  variant="ghost"
                  className="justify-start h-9 cursor-pointer"
                  onClick={() => openEarnDialog(customer)}
                  disabled={isEarning}
                >
                  {isEarning ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <PenLine className="mr-2 h-4 w-4" />
                  )}
                  Cộng điểm
                </Button>

                <Button
                  type="button"
                  variant="ghost"
                  className="justify-start h-9 cursor-pointer"
                  onClick={() => openRedeemDialog(customer)}
                  disabled={isRedeeming}
                >
                  {isRedeeming ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <PenLine className="mr-2 h-4 w-4" />
                  )}
                  Trừ điểm
                </Button>

                <Button
                  type="button"
                  variant="ghost"
                  className="justify-start h-9 cursor-pointer"
                  onClick={() => openEditDialog(customer)}
                  disabled={
                    (isUpdating && editingCustomer?.id === customer.id) ||
                    isCreating
                  }
                >
                  {isUpdating && editingCustomer?.id === customer.id ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <PenLine className="mr-2 h-4 w-4" />
                  )}
                  Cập nhật
                </Button>

                <Button
                  type="button"
                  variant="ghost"
                  className="justify-start h-9 cursor-pointer text-red-600 hover:text-red-700 hover:bg-red-50"
                  onClick={() => handleDeleteCustomer(customer)}
                  disabled={isDeleting || deletingId === customer.id}
                >
                  {deletingId === customer.id ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Trash2 className="mr-2 h-4 w-4" />
                  )}
                  Xoá
                </Button>
              </div>
            </PopoverContent> */}
            <PopoverContent align="end" className="w-44 p-2">
              <div className="flex flex-col gap-1">
                <Button
                  type="button"
                  variant="ghost"
                  className="justify-start h-9 cursor-pointer"
                  onClick={() => openHistoryDialog(customer)}
                  disabled={isHistoryLoading || isHistoryFetching}
                >
                  {isHistoryLoading || isHistoryFetching ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <History className="mr-2 h-4 w-4" />
                  )}
                  Lịch sử điểm
                </Button>

                <Button
                  type="button"
                  variant="ghost"
                  className="justify-start h-9 cursor-pointer"
                  onClick={() => openEarnDialog(customer)}
                  disabled={isEarning}
                >
                  {isEarning ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <PlusCircle className="mr-2 h-4 w-4" />
                  )}
                  Cộng điểm
                </Button>

                <Button
                  type="button"
                  variant="ghost"
                  className="justify-start h-9 cursor-pointer"
                  onClick={() => openRedeemDialog(customer)}
                  disabled={isRedeeming}
                >
                  {isRedeeming ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <MinusCircle className="mr-2 h-4 w-4" />
                  )}
                  Trừ điểm
                </Button>

                <Button
                  type="button"
                  variant="ghost"
                  className="justify-start h-9 cursor-pointer"
                  onClick={() => openEditDialog(customer)}
                  disabled={
                    (isUpdating && editingCustomer?.id === customer.id) ||
                    isCreating
                  }
                >
                  {isUpdating && editingCustomer?.id === customer.id ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Edit2 className="mr-2 h-4 w-4" />
                  )}
                  Cập nhật
                </Button>

                <Button
                  type="button"
                  variant="ghost"
                  className="justify-start h-9 cursor-pointer text-red-600 hover:text-red-700 hover:bg-red-50"
                  onClick={() => handleDeleteCustomer(customer)}
                  disabled={isDeleting || deletingId === customer.id}
                >
                  {deletingId === customer.id ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Trash className="mr-2 h-4 w-4" />
                  )}
                  Xoá
                </Button>
              </div>
            </PopoverContent>
          </Popover>
        </td>
      </tr>
    ));
  };

  return (
    <div className="mt-8  rounded-3xl border border-slate-100 bg-white">
      <div className="flex flex-col gap-4 border-b border-slate-100 px-6 py-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.3em] text-slate-400">
            Danh sách khách hàng
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Dialog
            open={isCreateOpen}
            onOpenChange={(open) => {
              setIsCreateOpen(open);
              if (!open) {
                setShouldLoadProvincesForCreate(false);
                createCustomerForm.reset(createEmptyCustomerForm());
              }
            }}
          >
            <DialogTrigger asChild>
              <Button
                type="button"
                className="cursor-pointer"
                onClick={() => setShouldLoadProvincesForCreate(true)}
              >
                Thêm khách hàng
              </Button>
            </DialogTrigger>

            <DialogContent className="max-w-lg sm:max-w-xl">
              <DialogHeader>
                <DialogTitle>Thêm khách hàng mới</DialogTitle>
              </DialogHeader>

              <Form {...createCustomerForm}>
                <form className="space-y-4" onSubmit={handleCreateCustomer}>
                  <FormField
                    control={createCustomerForm.control} // state. onChange, validation
                    name="fullName"
                    rules={{ required: "Vui lòng nhập họ tên" }}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Họ và tên</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="Nguyễn Văn A"
                            disabled={isCreating}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={createCustomerForm.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            type="email"
                            placeholder="email@example.com"
                            disabled={isCreating}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={createCustomerForm.control}
                    name="phone"
                    rules={{ required: "Vui lòng nhập số điện thoại" }}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Số điện thoại</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="090xxxxxxx"
                            disabled={isCreating}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={createCustomerForm.control}
                    name="province"
                    render={({ field }) => (
                      <FormItem className="space-y-2">
                        <FormLabel>Tỉnh / Thành phố </FormLabel>
                        <Popover
                          onOpenChange={(open) =>
                            open && setShouldLoadProvincesForCreate(true)
                          }
                        >
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              role="combobox"
                              className="h-10 w-full justify-between bg-white text-slate-700"
                              disabled={isCreating}
                            >
                              <span className="truncate">
                                {field.value
                                  ? provinceOptions.find(
                                      (p) => p.value === field.value,
                                    )?.label || field.value
                                  : "Chọn tỉnh / thành phố"}
                              </span>

                              <span className="flex items-center gap-2">
                                {(isLoadingCreate || isFetchingCreate) && (
                                  <Loader2 className="h-4 w-4 animate-spin text-slate-400" />
                                )}
                                <ChevronsUpDown className="h-4 w-4 opacity-50" />
                              </span>
                            </Button>
                          </PopoverTrigger>

                          <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
                            <Command>
                              <CommandInput placeholder="Tìm tỉnh / thành..." />
                              <CommandEmpty>
                                Không tìm thấy tỉnh phù hợp.
                              </CommandEmpty>

                              <CommandGroup
                                className="max-h-64 overflow-auto"
                                style={{ WebkitOverflowScrolling: "touch" }}
                              >
                                <CommandItem
                                  value="Tất cả"
                                  onSelect={() => field.onChange("")}
                                >
                                  <Check
                                    className={cn(
                                      "mr-2 h-4 w-4",
                                      field.value === ""
                                        ? "opacity-100"
                                        : "opacity-0",
                                    )}
                                  />
                                  Tất cả
                                </CommandItem>

                                {provinceOptions.map((province) => (
                                  <CommandItem
                                    key={province.value}
                                    value={province.label}
                                    onSelect={() =>
                                      field.onChange(province.value)
                                    }
                                  >
                                    <Check
                                      className={cn(
                                        "mr-2 h-4 w-4",
                                        field.value === province.value
                                          ? "opacity-100"
                                          : "opacity-0",
                                      )}
                                    />
                                    {province.label}
                                  </CommandItem>
                                ))}
                              </CommandGroup>
                            </Command>
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={createCustomerForm.control}
                    name="referralCode"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Mã giới thiệu (nếu có)</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="Nhập mã giới thiệu"
                            disabled={isCreating}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <DialogFooter>
                    <Button
                      type="submit"
                      className="w-full cursor-pointer"
                      disabled={isCreating}
                    >
                      {isCreating ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      ) : null}
                      Tạo khách hàng
                    </Button>
                  </DialogFooter>
                </form>
              </Form>
            </DialogContent>
          </Dialog>

          <Button
            type="button"
            variant="outline"
            className="cursor-pointer"
            onClick={handleExportCustomers}
            disabled={isExporting || isApplyingFilters || isFetching}
          >
            {isExporting ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : null}
            Xuất Excel
          </Button>

          <Button
            type="button"
            variant="outline"
            className="cursor-pointer"
            onClick={handleResetFilters}
          >
            Đặt lại bộ lọc
          </Button>

          <Dialog
            open={isEditOpen}
            onOpenChange={(open) => {
              if (!open) {
                closeEditDialog();
              }
            }}
          >
            <DialogContent className="max-w-lg sm:max-w-xl">
              <DialogHeader>
                <DialogTitle>Cập nhật khách hàng</DialogTitle>
              </DialogHeader>

              <Form {...editCustomerForm}>
                <form className="space-y-4" onSubmit={handleUpdateCustomer}>
                  <FormField
                    control={editCustomerForm.control}
                    name="fullName"
                    rules={{ required: "Vui lòng nhập họ tên" }}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Họ và tên</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="Nguyễn Văn A"
                            disabled={isUpdating}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={editCustomerForm.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            type="email"
                            placeholder="email@example.com"
                            disabled={isUpdating}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={editCustomerForm.control}
                    name="phone"
                    rules={{ required: "Vui lòng nhập số điện thoại" }}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Số điện thoại</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="090xxxxxxx"
                            disabled={isUpdating}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={editCustomerForm.control}
                    name="province"
                    render={({ field }) => (
                      <FormItem className="space-y-2">
                        <FormLabel>Tỉnh / Thành phố </FormLabel>
                        <Popover
                          onOpenChange={(open) =>
                            open && setShouldLoadProvincesForEdit(true)
                          }
                        >
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              role="combobox"
                              className="h-10 w-full justify-between bg-white text-slate-700"
                              disabled={isUpdating}
                            >
                              <span className="truncate">
                                {field.value
                                  ? provinceOptions.find(
                                      (p) => p.value === field.value,
                                    )?.label || field.value
                                  : "Chọn tỉnh / thành phố"}
                              </span>

                              <span className="flex items-center gap-2">
                                {(isLoadingEdit || isFetchingEdit) && (
                                  <Loader2 className="h-4 w-4 animate-spin text-slate-400" />
                                )}
                                <ChevronsUpDown className="h-4 w-4 opacity-50" />
                              </span>
                            </Button>
                          </PopoverTrigger>

                          <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
                            <Command>
                              <CommandInput placeholder="Tìm tỉnh / thành..." />
                              <CommandEmpty>
                                Không tìm thấy tỉnh phù hợp.
                              </CommandEmpty>

                              <CommandGroup
                                onWheel={(e) => {
                                  e.currentTarget.scrollTop += e.deltaY;
                                }}
                                className="max-h-64 overflow-auto"
                              >
                                <CommandItem
                                  value="Tất cả"
                                  onSelect={() => field.onChange("")}
                                >
                                  <Check
                                    className={cn(
                                      "mr-2 h-4 w-4",
                                      field.value === ""
                                        ? "opacity-100"
                                        : "opacity-0",
                                    )}
                                  />
                                  Tất cả
                                </CommandItem>

                                {provinceOptions.map((province) => (
                                  <CommandItem
                                    key={province.value}
                                    value={province.label}
                                    onSelect={() =>
                                      field.onChange(province.value)
                                    }
                                  >
                                    <Check
                                      className={cn(
                                        "mr-2 h-4 w-4",
                                        field.value === province.value
                                          ? "opacity-100"
                                          : "opacity-0",
                                      )}
                                    />
                                    {province.label}
                                  </CommandItem>
                                ))}
                              </CommandGroup>
                            </Command>
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={editCustomerForm.control}
                    name="referralCode"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Mã giới thiệu (nếu có)</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="Nhập mã giới thiệu"
                            disabled={isUpdating}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <DialogFooter>
                    <Button
                      type="submit"
                      className="w-full cursor-pointer"
                      disabled={isUpdating}
                    >
                      {isUpdating ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      ) : null}
                      Cập nhật khách hàng
                    </Button>
                  </DialogFooter>
                </form>
              </Form>
            </DialogContent>
          </Dialog>

          <Dialog
            open={isRedeemOpen}
            onOpenChange={(open) => {
              if (!open) {
                closeRedeemDialog();
              }
            }}
          >
            <DialogContent>
              <DialogHeader>
                <DialogTitle>
                  {redeemMode === "earn"
                    ? "Cộng điểm khách hàng"
                    : "Trừ điểm khách hàng"}
                </DialogTitle>
              </DialogHeader>

              <Form {...redeemPointsForm}>
                <form className="space-y-4" onSubmit={handleRedeemPoints}>
                  <div className="text-sm text-slate-500">
                    Khách hàng:{" "}
                    <span className="font-medium text-slate-700">
                      {redeemCustomer?.fullName}
                    </span>
                  </div>

                  <FormField
                    control={redeemPointsForm.control}
                    name="points"
                    rules={{ required: "Vui lòng nhập số điểm" }}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Số điểm ({redeemMode === "earn" ? "cộng" : "trừ"})
                        </FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            type="number"
                            inputMode="numeric"
                            placeholder="Nhập số điểm"
                            disabled={isRedeeming || isEarning}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={redeemPointsForm.control}
                    name="reason"
                    rules={{ required: "Vui lòng nhập lý do" }}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Lý do</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="Nhập lý do thay đổi"
                            disabled={isRedeeming || isEarning}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <DialogFooter>
                    <Button
                      type="submit"
                      className="w-full cursor-pointer"
                      disabled={isRedeeming || isEarning}
                    >
                      {isRedeeming || isEarning ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      ) : null}
                      Xác nhận
                    </Button>
                  </DialogFooter>
                </form>
              </Form>
            </DialogContent>
          </Dialog>

          <Dialog
            open={isHistoryOpen}
            onOpenChange={(open) => {
              if (!open) {
                closeHistoryDialog();
              }
            }}
          >
            <DialogContent className="w-[90vw] max-w-4xl md:max-w-5xl rounded-2xl border border-slate-100 bg-white shadow-xl">
              <DialogHeader className="pb-2">
                <DialogTitle className="text-lg font-semibold text-slate-900">
                  Lịch sử thay đổi điểm
                </DialogTitle>
              </DialogHeader>

              <div className="space-y-5 text-sm text-slate-600 md:text-base">
                <div className="flex flex-wrap items-center gap-2 rounded-xl bg-slate-50 px-4 py-3 text-sm text-slate-700">
                  <span className="text-base font-semibold text-slate-900">
                    {historyCustomer?.fullName}
                  </span>
                  {historyCustomer?.customerCode && (
                    <span className="rounded-full bg-white px-3 py-1 text-xs font-medium text-slate-600 shadow-sm ring-1 ring-slate-200">
                      {historyCustomer.customerCode}
                    </span>
                  )}
                  {historyCustomer?.phone && (
                    <span className="rounded-full bg-white px-3 py-1 text-xs font-medium text-slate-600 shadow-sm ring-1 ring-slate-200">
                      {historyCustomer.phone}
                    </span>
                  )}
                </div>

                <div className="w-full overflow-x-auto">
                  <table className="min-w-[900px] w-full table-fixed text-left">
                    <thead className="bg-slate-50 text-xs uppercase tracking-[0.08em] text-slate-500">
                      <tr>
                        <th className="px-5 py-3 text-left font-semibold">
                          Thời gian
                        </th>
                        <th className="px-5 py-3 text-right font-semibold">
                          Thay đổi
                        </th>
                        <th className="px-5 py-3 text-left font-semibold">
                          Lý do
                        </th>
                        <th className="px-5 py-3 text-left font-semibold">
                          Người thực hiện
                        </th>
                      </tr>
                    </thead>
                    <tbody className="text-sm md:text-base">
                      {isHistoryLoading ? (
                        <tr>
                          <td
                            colSpan={4}
                            className="px-5 py-7 text-center text-slate-500"
                          >
                            <Loader2 className="mr-2 inline h-4 w-4 animate-spin text-sky-500" />
                            Đang tải lịch sử...
                          </td>
                        </tr>
                      ) : historyData?.data?.length ? (
                        historyData.data.map((item) => {
                          const amount = item.changeAmount ?? 0;
                          const formattedDate = item.createdAt
                            ? new Date(item.createdAt).toLocaleString("vi-VN")
                            : "—";
                          const isPositive = amount >= 0;
                          return (
                            <tr
                              key={item.id}
                              className="odd:bg-white even:bg-slate-50/60 hover:bg-sky-50/70 transition-colors"
                            >
                              <td className="px-5 py-4 text-slate-800 whitespace-nowrap">
                                {formattedDate}
                              </td>
                              <td className="px-5 py-4 text-right font-semibold">
                                <span
                                  className={`inline-flex min-w-[88px] items-center justify-end rounded-full px-3 py-1 text-sm ${
                                    isPositive
                                      ? "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-100"
                                      : "bg-rose-50 text-rose-700 ring-1 ring-rose-100"
                                  }`}
                                >
                                  {isPositive ? "+" : ""}
                                  {Number(amount).toLocaleString("vi-VN")}
                                </span>
                              </td>
                              <td className="px-5 py-4 text-slate-800 max-w-[220px]">
                                <TooltipProvider>
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <span className="block truncate cursor-pointer">
                                        {item.reason || "—"}
                                      </span>
                                    </TooltipTrigger>
                                    <TooltipContent
                                      side="top"
                                      align="start"
                                      collisionPadding={16}
                                      className="max-w-[320px] px-4 py-2 whitespace-normal break-words"
                                      style={{ overflowWrap: "anywhere" }}
                                    >
                                      {item.reason || "—"}
                                    </TooltipContent>
                                  </Tooltip>
                                </TooltipProvider>
                              </td>
                              <td className="px-5 py-4 text-slate-800">
                                <div className="flex items-center gap-2">
                                  <span className="font-semibold text-slate-900">
                                    {item.user?.username || "—"}
                                  </span>
                                  {item.user?.role ? (
                                    <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wide text-slate-600 ring-1 ring-slate-200">
                                      {item.user.role}
                                    </span>
                                  ) : null}
                                </div>
                              </td>
                            </tr>
                          );
                        })
                      ) : (
                        <tr>
                          <td
                            colSpan={4}
                            className="px-5 py-7 text-center text-slate-500"
                          >
                            Chưa có lịch sử điểm.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>

                <div className="flex flex-col gap-3 rounded-xl border border-slate-100 bg-slate-50/60 px-4 py-3 text-sm text-slate-600 md:flex-row md:items-center md:justify-between">
                  <span className="font-medium text-slate-700">
                    Trang {historyPage + 1} /{" "}
                    {Math.max(historyData?.totalPages ?? 1, 1)}
                    {historyData?.totalItems
                      ? ` • Tổng ${historyData.totalItems} bản ghi`
                      : ""}
                  </span>
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      className="cursor-pointer border-slate-200 bg-white"
                      disabled={historyPage <= 0 || isHistoryFetching}
                      onClick={() => setHistoryPage((p) => Math.max(p - 1, 0))}
                    >
                      Trang trước
                    </Button>
                    <Button
                      type="button"
                      className="cursor-pointer bg-slate-900 text-white hover:bg-slate-800"
                      disabled={
                        isHistoryFetching ||
                        (historyData?.totalPages ?? 1) === 0 ||
                        historyPage >= (historyData?.totalPages ?? 1) - 1
                      }
                      onClick={() =>
                        setHistoryPage((p) => {
                          const maxPage = Math.max(
                            (historyData?.totalPages ?? 1) - 1,
                            0,
                          );
                          return Math.min(p + 1, maxPage);
                        })
                      }
                    >
                      Trang sau
                    </Button>
                  </div>
                </div>
              </div>
            </DialogContent>
          </Dialog>

          <Dialog open={isDeleteDialogOpen} onOpenChange={closeDeleteDialog}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Xác nhận xoá khách hàng</DialogTitle>
              </DialogHeader>

              <div className="space-y-4">
                <p className="text-sm text-slate-600">
                  Bạn có chắc chắn muốn xoá khách hàng{" "}
                  <span className="font-medium">
                    {customerToDelete?.fullName}
                  </span>{" "}
                  (
                  <span className="font-medium">{customerToDelete?.phone}</span>
                  )?
                </p>
              </div>

              <DialogFooter className="gap-3">
                <Button
                  type="button"
                  variant="outline"
                  className="cursor-pointer"
                  onClick={closeDeleteDialog}
                  disabled={isDeleting || deletingId === customerToDelete?.id}
                >
                  Hủy
                </Button>
                <Button
                  type="button"
                  variant="destructive"
                  className="cursor-pointer"
                  onClick={handleConfirmDelete}
                  disabled={isDeleting || deletingId === customerToDelete?.id}
                >
                  {deletingId === customerToDelete?.id ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : null}
                  Xoá
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <form
        onSubmit={handleApplyFilters}
        className="grid gap-4 border-b border-slate-100 px-6 py-4 md:grid-cols-4 items-end"
      >
        <div className="space-y-2">
          <Label htmlFor="phone-filter">Số điện thoại</Label>
          <Input
            id="phone-filter"
            placeholder="Ví dụ: 0903..."
            value={formFilters.phone}
            onChange={(event) =>
              setFormFilters((prev) => ({ ...prev, phone: event.target.value }))
            }
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="name-filter">Tên khách hàng</Label>
          <Input
            id="name-filter"
            placeholder="Nhập tên khách"
            value={formFilters.fullName}
            onChange={(event) =>
              setFormFilters((prev) => ({
                ...prev,
                fullName: event.target.value,
              }))
            }
          />
        </div>

        <div className="space-y-2">
          <Label>Tỉnh / Thành phố</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                className=" w-full justify-between bg-white text-slate-700"
                onClick={() => setShouldLoadProvincesForFilter(true)}
              >
                <span className="truncate">
                  {formFilters.province
                    ? provinceOptions.find(
                        (p) => p.value === formFilters.province,
                      )?.label || formFilters.province
                    : "Chọn tỉnh / thành phố"}
                </span>

                <span className="flex items-center gap-2">
                  {(isLoadingFilter || isFetchingFilter) && (
                    <Loader2 className="h-4 w-4 animate-spin text-slate-400" />
                  )}
                  <ChevronsUpDown className="h-4 w-4 opacity-50" />
                </span>
              </Button>
            </PopoverTrigger>

            <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
              <Command>
                <CommandInput placeholder="Tìm tỉnh / thành..." />
                <CommandEmpty>Không tìm thấy tỉnh phù hợp.</CommandEmpty>

                <CommandGroup className="max-h-64 overflow-auto">
                  <CommandItem
                    value="Tất cả"
                    onSelect={() =>
                      setFormFilters((prev) => ({ ...prev, province: "" }))
                    }
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        formFilters.province === ""
                          ? "opacity-100"
                          : "opacity-0",
                      )}
                    />
                    Tất cả
                  </CommandItem>

                  {provinceOptions.map((province) => (
                    <CommandItem
                      key={province.value}
                      value={province.label}
                      onSelect={() =>
                        setFormFilters((prev) => ({
                          ...prev,
                          province: province.value,
                        }))
                      }
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          formFilters.province === province.value
                            ? "opacity-100"
                            : "opacity-0",
                        )}
                      />
                      {province.label}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </Command>
            </PopoverContent>
          </Popover>
        </div>

        <Button
          type="submit"
          className="w-full cursor-pointer"
          disabled={isApplyingFilters}
        >
          {isApplyingFilters ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : null}
          Tìm kiếm
        </Button>
      </form>

      <div className="w-full max-w-full overflow-x-auto max-h-[500px] overflow-y-auto">
        <table className="min-w-[760px] md:min-w-[920px] table-fixed divide-y divide-slate-100 text-left text-xs md:text-sm">
          <thead className="bg-sky-50/70 text-[11px] md:text-xs uppercase tracking-wider text-slate-500">
            <tr>
              <th className="px-3 md:px-4 py-3 whitespace-nowrap">Mã khách hàng</th>
              <th className="px-3 md:px-4 py-3 whitespace-nowrap">Khách hàng</th>
              <th className="px-3 md:px-4 py-3 whitespace-nowrap">Email</th>
              <th className="px-3 md:px-4 py-3 whitespace-nowrap">Điểm tích lũy</th>
              <th className="px-3 md:px-4 py-3 whitespace-nowrap">Tỉnh / Thành</th>
              <th className="px-3 md:px-4 py-3 whitespace-nowrap">Mã giới thiệu</th>
              <th className="px-3 md:px-4 py-3 whitespace-nowrap text-right">
                Hành động
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-250 text-xs md:text-sm [&>tr:nth-child(even)]:bg-slate-50/50">
            {renderTableBody()}
          </tbody>
        </table>
      </div>

      <div className="flex flex-col gap-3 border-t border-slate-100 px-6 py-4 text-sm text-slate-500 md:flex-row md:items-center md:justify-between">
        <p>
          Trang {normalizedCurrentPage} / {Math.max(totalPages, 1)}
          {typeof totalItems === "number" &&
            totalItems > 0 &&
            ` • Tổng cộng ${totalItems} khách hàng`}
        </p>
        <div className="flex gap-3">
          <Button
            type="button"
            variant="outline"
            className="cursor-pointer"
            disabled={page <= 0}
            onClick={() => handlePageChange(-1)}
          >
            Trang trước
          </Button>
          <Button
            type="button"
            className="cursor-pointer"
            disabled={totalPages === 0 || page >= totalPages - 1}
            onClick={() => handlePageChange(1)}
          >
            Trang sau
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CustomerManagement;
