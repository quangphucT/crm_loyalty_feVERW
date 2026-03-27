"use client";

import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { Check, ChevronsUpDown, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useCustomers } from "@/hooks/useCustomers";
import { useProvinces } from "@/hooks/useProvinces ";
import { useCreateCustomer } from "@/hooks/useCreateCustomer";
import { Customer, CreateCustomerRequest } from "@/types/customer.type";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { cn } from "@/lib/utils";
import { ProvinceOption } from "@/types/province.type";
import { toast } from "react-toastify";
import { ErrorResponse } from "@/types/auth.type";

const createEmptyFilters = () => ({ phone: "", fullName: "", province: "" });
const createEmptyCustomerForm = (): CreateCustomerRequest => ({
  fullName: "",
  phone: "",
  email: "",
  province: "",
  referralCode: "",
});

const CustomerManagement = () => {
  const [formFilters, setFormFilters] = useState(createEmptyFilters());
  const [appliedFilters, setAppliedFilters] = useState(createEmptyFilters());
  const [page, setPage] = useState(0);
  const [shouldLoadProvinces, setShouldLoadProvinces] = useState(false);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const size = 2;
  const {
    data: provincesData = [],
    isLoading: isProvinceLoading,
    isFetching: isProvinceFetching,
  } = useProvinces({ enabled: shouldLoadProvinces });
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
  }, [provincesData]);

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

  const { mutateAsync: createCustomer, isPending: isCreating } =
    useCreateCustomer();
  const handleApplyFilters = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setAppliedFilters({ ...formFilters });
    setPage(0);
  };

  const handleResetFilters = () => {
    const nextFilters = createEmptyFilters();
    setFormFilters(nextFilters);
    setAppliedFilters(nextFilters);
    setPage(0);
  };

  const handleCreateCustomer = createCustomerForm.handleSubmit(
    async (values) => {
      try {
        await createCustomer({
          ...values,
          email: values.email || undefined,
          province: values.province || undefined,
          referralCode: values.referralCode || undefined,
        });
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

  const handlePageChange = (direction: -1 | 1) => {
    setPage((prev) => {
      const next = prev + direction;
      if (next < 0) return 0;
      const maxPageIndex = Math.max((totalPages || 1) - 1, 0);
      return next > maxPageIndex ? maxPageIndex : next;
    });
  };

  const renderTableBody = () => {
    if (isLoading) {
      return (
        <tr>
          <td colSpan={6} className="px-6 py-10 text-center text-slate-500">
            <Loader2 className="mx-auto mb-2 h-5 w-5 animate-spin text-sky-500" />
            Đang tải dữ liệu khách hàng...
          </td>
        </tr>
      );
    }

    if (!customers.length) {
      return (
        <tr>
          <td colSpan={6} className="px-6 py-10 text-center text-slate-500">
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
        <td className="px-6 py-4 font-medium text-slate-900">
          {customer.fullName}
          <p className="text-xs text-slate-400">{customer.phone}</p>
        </td>
        <td className="px-6 py-4 text-slate-700">{customer.email || "—"}</td>
        <td className="px-6 py-4 text-slate-700">
          {(customer.totalPoints ?? 0).toLocaleString("vi-VN")}
        </td>
        <td className="px-6 py-4">
          <span className="rounded-full bg-sky-50 px-3 py-1 text-xs text-sky-600">
            {customer.province || "N/A"}
          </span>
        </td>
        <td className="px-6 py-4 text-slate-700">
          {customer.referralCode || "Chưa có"}
        </td>
        <td className="px-6 py-4 text-right">
          <button
            className="text-sm font-medium text-sky-600 hover:text-sky-700"
            type="button"
          >
            Xem hồ sơ
          </button>
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
          <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
            <DialogTrigger asChild>
              <Button
                type="button"
                className="cursor-pointer"
                onClick={() => setShouldLoadProvinces(true)}
              >
                Thêm khách hàng
              </Button>
            </DialogTrigger>

            <DialogContent>
              <DialogHeader>
                <DialogTitle>Thêm khách hàng mới</DialogTitle>
              </DialogHeader>

              <Form {...createCustomerForm}>
                <form className="space-y-4" onSubmit={handleCreateCustomer}>
                  <FormField
                    control={createCustomerForm.control}
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
                    name="province"
                    render={({ field }) => (
                      <FormItem className="space-y-2">
                        <FormLabel>Tỉnh / Thành phố </FormLabel>
                        <Popover
                          onOpenChange={(open) =>
                            open && setShouldLoadProvinces(true)
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
                                {(isProvinceLoading || isProvinceFetching) && (
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
                      className="w-full"
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
            onClick={handleResetFilters}
          >
            Đặt lại bộ lọc
          </Button>
        </div>
      </div>

      <form
        onSubmit={handleApplyFilters}
        className="grid gap-4 border-b border-slate-100 px-6 py-4 md:grid-cols-4"
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
                className="h-10 w-full justify-between bg-white text-slate-700"
                onClick={() => setShouldLoadProvinces(true)}
              >
                <span className="truncate">
                  {formFilters.province
                    ? provinceOptions.find(
                        (p) => p.value === formFilters.province,
                      )?.label || formFilters.province
                    : "Chọn tỉnh / thành phố"}
                </span>

                <span className="flex items-center gap-2">
                  {(isProvinceLoading || isProvinceFetching) && (
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
          disabled={isFetching}
        >
          {isFetching ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : null}
          Tìm kiếm
        </Button>
      </form>

      <div className="overflow-auto">
        <table className="w-full min-w-[720px] divide-y divide-slate-100 text-left">
          <thead className="bg-sky-50/70 text-xs uppercase tracking-wider text-slate-500">
            <tr>
              <th className="px-6 py-3">Khách hàng</th>
              <th className="px-6 py-3">Email</th>
              <th className="px-6 py-3">Điểm tích lũy</th>
              <th className="px-6 py-3">Tỉnh / Thành</th>
              <th className="px-6 py-3">Mã giới thiệu</th>
              <th className="px-6 py-3"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-sm">
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
