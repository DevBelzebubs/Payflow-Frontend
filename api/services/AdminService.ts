import { api } from "../axiosConfig";

export interface AdminStats {
  totalUsuarios: number;
  totalClientes: number;
  totalAdmins: number;
  totalProductos: number;
  totalServicios: number;
  totalOrdenes: number;
  usuariosActivos: number;
}

export interface AdminUser {
  id: string;
  email: string;
  nombre: string;
  telefono: string | null;
  activo: boolean;
  rol: string;
  dni: string;
  avatar_url: string | null;
  banner_url: string | null;
  created_at: string;
  admin_id: string | null;
  nivelAcceso: string | null;
}

export interface AdminProduct {
  id: string;
  nombre: string;
  descripcion: string;
  precio: number;
  stock: number;
  categoria: string;
  activo: boolean;
  imagen_url: string | null;
  marca: string | null;
  especificaciones: any;
  imagenes: any[];
  reseñas: any[];
  rating_promedio: number;
  total_reseñas: number;
}

export interface AdminKPIs extends AdminStats, SalesStats {}

export interface SalesStats {
  totalRevenue: number;
  averageOrderValue: number;
  totalOrders: number;
  ordersByStatus: {
    pendientes: number;
    confirmadas: number;
    completadas: number;
    canceladas: number;
  };
  monthlyRevenue: Array<{
    year: number;
    month: number;
    ingresos: number;
    ordenes: number;
  }>;
  today: {
    orders: number;
    revenue: number;
  };
}

export interface AdminServicio {
  idServicio: string;
  nombre: string;
  descripcion: string;
  recibo: number;
  imagenURL: string | null;
  tipo_servicio: string;
  sinopsis: string | null;
  fecha_evento: string | null;
  video_url: string | null;
  proveedor: string | null;
  rating: number | null;
  info_adicional_json: any;
  activo: boolean;
  cliente_id: string | null;
}

export interface AdminRecord {
  id: string;
  usuarioId: string;
  nivelAcceso: string;
  usuario: {
    id: string;
    email: string;
    nombre: string;
    telefono: string;
    activo: boolean;
  };
}

const getStats = async (): Promise<AdminStats> => {
  try {
    const response = await api.get<AdminStats>("/admin/stats");
    return response.data;
  } catch (error: any) {
    console.error("Error obteniendo estadísticas:", error.response?.data?.error || error.message);
    throw new Error(error.response?.data?.error || "Error al obtener estadísticas");
  }
};

const getUsuarios = async (): Promise<AdminUser[]> => {
  try {
    const response = await api.get<AdminUser[]>("/admin/usuarios");
    return response.data;
  } catch (error: any) {
    console.error("Error obteniendo usuarios:", error.response?.data?.error || error.message);
    throw new Error(error.response?.data?.error || "Error al obtener usuarios");
  }
};

const getUsuarioById = async (id: string): Promise<AdminUser> => {
  try {
    const response = await api.get<AdminUser>(`/admin/usuarios/${id}`);
    return response.data;
  } catch (error: any) {
    console.error("Error obteniendo usuario:", error.response?.data?.error || error.message);
    throw new Error(error.response?.data?.error || "Error al obtener usuario");
  }
};

const updateUsuarioRol = async (id: string, rol: string, nivelAcceso?: string): Promise<AdminUser> => {
  try {
    const response = await api.put<AdminUser>(`/admin/usuarios/${id}/rol`, { rol, nivelAcceso });
    return response.data;
  } catch (error: any) {
    console.error("Error actualizando rol:", error.response?.data?.error || error.message);
    throw new Error(error.response?.data?.error || "Error al actualizar rol");
  }
};

const toggleUsuarioActivo = async (id: string): Promise<AdminUser> => {
  try {
    const response = await api.put<AdminUser>(`/admin/usuarios/${id}/activo`);
    return response.data;
  } catch (error: any) {
    console.error("Error cambiando estado:", error.response?.data?.error || error.message);
    throw new Error(error.response?.data?.error || "Error al cambiar estado");
  }
};

const getAdministradores = async (): Promise<AdminRecord[]> => {
  try {
    const response = await api.get<AdminRecord[]>("/administradores");
    return response.data;
  } catch (error: any) {
    console.error("Error obteniendo administradores:", error.response?.data?.error || error.message);
    throw new Error(error.response?.data?.error || "Error al obtener administradores");
  }
};

const createAdministrador = async (usuario_id: string, nivel_acceso: string): Promise<AdminRecord> => {
  try {
    const response = await api.post<AdminRecord>("/administradores", { usuario_id, nivel_acceso });
    return response.data;
  } catch (error: any) {
    console.error("Error creando administrador:", error.response?.data?.error || error.message);
    throw new Error(error.response?.data?.error || "Error al crear administrador");
  }
};

const deleteAdministrador = async (adminId: string): Promise<void> => {
  try {
    await api.delete(`/admin/administradores/${adminId}`);
  } catch (error: any) {
    console.error("Error eliminando administrador:", error.response?.data?.error || error.message);
    throw new Error(error.response?.data?.error || "Error al eliminar administrador");
  }
};

const getProductos = async (): Promise<AdminProduct[]> => {
  try {
    const response = await api.get<AdminProduct[]>("/admin/productos");
    return response.data;
  } catch (error: any) {
    console.error("Error obteniendo productos:", error.response?.data?.error || error.message);
    throw new Error(error.response?.data?.error || "Error al obtener productos");
  }
};

const getProductoById = async (id: string): Promise<AdminProduct> => {
  try {
    const response = await api.get<AdminProduct>(`/admin/productos/${id}`);
    return response.data;
  } catch (error: any) {
    console.error("Error obteniendo producto:", error.response?.data?.error || error.message);
    throw new Error(error.response?.data?.error || "Error al obtener producto");
  }
};

const createProducto = async (data: FormData): Promise<AdminProduct> => {
  try {
    const response = await api.post<AdminProduct>("/admin/productos", data, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  } catch (error: any) {
    console.error("Error creando producto:", error.response?.data?.error || error.message);
    throw new Error(error.response?.data?.error || "Error al crear producto");
  }
};

const updateProducto = async (id: string, data: any): Promise<AdminProduct> => {
  try {
    const response = await api.put<AdminProduct>(`/admin/productos/${id}`, data);
    return response.data;
  } catch (error: any) {
    console.error("Error actualizando producto:", error.response?.data?.error || error.message);
    throw new Error(error.response?.data?.error || "Error al actualizar producto");
  }
};

const deleteProducto = async (id: string): Promise<void> => {
  try {
    await api.delete(`/admin/productos/${id}`);
  } catch (error: any) {
    console.error("Error eliminando producto:", error.response?.data?.error || error.message);
    throw new Error(error.response?.data?.error || "Error al eliminar producto");
  }
};

const getKPIs = async (): Promise<AdminKPIs> => {
  try {
    const response = await api.get<AdminKPIs>("/admin/kpis");
    return response.data;
  } catch (error: any) {
    console.error("Error obteniendo KPIs:", error.response?.data?.error || error.message);
    throw new Error(error.response?.data?.error || "Error al obtener KPIs del dashboard");
  }
};

const getSalesStats = async (): Promise<SalesStats> => {
  try {
    const response = await api.get<SalesStats>("/admin/ordenes/stats");
    return response.data;
  } catch (error: any) {
    console.error("Error obteniendo stats de ventas:", error.response?.data?.error || error.message);
    throw new Error(error.response?.data?.error || "Error al obtener estadísticas de ventas");
  }
};

const getServicios = async (): Promise<AdminServicio[]> => {
  try {
    const response = await api.get<AdminServicio[]>("/admin/servicios");
    return response.data;
  } catch (error: any) {
    console.error("Error obteniendo servicios:", error.response?.data?.error || error.message);
    throw new Error(error.response?.data?.error || "Error al obtener servicios");
  }
};

const getServicioById = async (id: string): Promise<AdminServicio> => {
  try {
    const response = await api.get<AdminServicio>(`/admin/servicios/${id}`);
    return response.data;
  } catch (error: any) {
    console.error("Error obteniendo servicio:", error.response?.data?.error || error.message);
    throw new Error(error.response?.data?.error || "Error al obtener servicio");
  }
};

const createServicio = async (data: Partial<AdminServicio>): Promise<AdminServicio> => {
  try {
    const response = await api.post<AdminServicio>("/admin/servicios", data);
    return response.data;
  } catch (error: any) {
    console.error("Error creando servicio:", error.response?.data?.error || error.message);
    throw new Error(error.response?.data?.error || "Error al crear servicio");
  }
};

const updateServicio = async (id: string, data: Partial<AdminServicio>): Promise<AdminServicio> => {
  try {
    const response = await api.put<AdminServicio>(`/admin/servicios/${id}`, data);
    return response.data;
  } catch (error: any) {
    console.error("Error actualizando servicio:", error.response?.data?.error || error.message);
    throw new Error(error.response?.data?.error || "Error al actualizar servicio");
  }
};

const deleteServicio = async (id: string): Promise<void> => {
  try {
    await api.delete(`/admin/servicios/${id}`);
  } catch (error: any) {
    console.error("Error eliminando servicio:", error.response?.data?.error || error.message);
    throw new Error(error.response?.data?.error || "Error al eliminar servicio");
  }
};

const updateProductoStock = async (id: string, cantidad: number): Promise<AdminProduct> => {
  try {
    const response = await api.patch<AdminProduct>(`/admin/productos/${id}/stock`, { cantidad });
    return response.data;
  } catch (error: any) {
    console.error("Error actualizando stock:", error.response?.data?.error || error.message);
    throw new Error(error.response?.data?.error || "Error al actualizar stock");
  }
};

export const AdminService = {
  getStats,
  getKPIs,
  getSalesStats,
  getUsuarios,
  getUsuarioById,
  updateUsuarioRol,
  toggleUsuarioActivo,
  getAdministradores,
  createAdministrador,
  deleteAdministrador,
  getProductos,
  getProductoById,
  createProducto,
  updateProducto,
  deleteProducto,
  updateProductoStock,
  getServicios,
  getServicioById,
  createServicio,
  updateServicio,
  deleteServicio,
};
