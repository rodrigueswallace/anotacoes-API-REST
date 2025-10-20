import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { departmentsService } from "@/services/departments.service";
import type { CreateDepartmentInput, UpdateDepartmentInput } from "@/types/department.types";

export const useDepartments = () => {
  const query = useQuery({
    queryKey: ["departments"],
    queryFn: () => departmentsService.getAllDepartments(),
  });

  return {
    data: query.data,
    isLoading: query.isLoading,
    error: query.error,
    refetch: query.refetch,
  };
};

export const useDepartment = (id?: number) => {
  return useQuery({
    queryKey: ["department", id],
    queryFn: () => departmentsService.getDepartmentById(id!),
    enabled: !!id,
  });
};

export const useDepartmentsByUnit = (unitId?: number) => {
  return useQuery({
    queryKey: ["departments", "unit", unitId],
    queryFn: () => departmentsService.getDepartmentsByUnitId(unitId!),
    enabled: !!unitId,
  });
};

export const useCreateDepartment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CreateDepartmentInput) =>
      departmentsService.createDepartment(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["departments"] });
    },
  });
};

export const useUpdateDepartment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: UpdateDepartmentInput) =>
      departmentsService.updateDepartment(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["departments"] });
    },
  });
};

export const useToggleDepartmentStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, currentStatus }: { id: number; currentStatus: boolean }) =>
      departmentsService.toggleDepartmentStatus(id, currentStatus),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["departments"] });
    },
  });
};
