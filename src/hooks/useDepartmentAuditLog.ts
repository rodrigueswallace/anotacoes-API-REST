import { useQuery } from '@tanstack/react-query';
import { getDepartmentAuditLog } from '@/services/department-audit.service';

export function useDepartmentAuditLog(departmentId: number | null) {
  return useQuery({
    queryKey: ['departmentAuditLog', departmentId],
    queryFn: () => departmentId ? getDepartmentAuditLog(departmentId) : Promise.resolve([]),
    enabled: !!departmentId,
  });
}
