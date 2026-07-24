"use client";

import { useState, useMemo, useEffect } from "react";
import {
  Plus, Edit, Trash2, CheckCircle2, Search,
  UserPlus, Briefcase, ListTodo, X, Users, ClipboardList, Globe, History
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { motion, AnimatePresence } from "framer-motion";
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import {
  addRencanaKinerjaAction,
  updateRencanaKinerjaAction,
  deleteRencanaKinerjaAction,
  assignSelfToRencanaKinerjaAction,
  removeAssignmentAction,
} from "../actions/rencana-kinerja";
import { toast } from "sonner";
import { Select } from "@/components/ui/select";
import { Header } from "@/components/layout/header";

/* ───────────────────────────────────────────── */
/*  Types                                        */
/* ───────────────────────────────────────────── */
interface RencanaKinerjaClientProps {
  currentUser: any;
  allRKs: any[];
  myAssignments: any[];
  myManagedRKs: any[];
  allUsers: any[];
  timKerjaList: string[];
  auditLogs: any[];
}

/* ───────────────────────────────────────────── */
/*  Component                                    */
/* ───────────────────────────────────────────── */
export function RencanaKinerjaClient({
  currentUser,
  allRKs,
  myAssignments,
  myManagedRKs,
  allUsers,
  timKerjaList,
  auditLogs = [],
}: RencanaKinerjaClientProps) {
  const isKetuaTim = ["ketua_tim", "pimpinan", "admin"].includes(currentUser?.role || "");

  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  const [activeTab, setActiveTab] = useState(isKetuaTim ? "managed" : "my_rk");
  const [rkModalOpen, setRkModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [assignModalOpen, setAssignModalOpen] = useState(false);
  const [selectedRkToAssign, setSelectedRkToAssign] = useState("");
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<{id: string, name?: string, type: 'assignment' | 'rk'} | null>(null);
  const [searchManaged, setSearchManaged] = useState("");
  const [searchAssignee, setSearchAssignee] = useState("");
  const [searchGlobal, setSearchGlobal] = useState("");
  const [filterGlobalTeam, setFilterGlobalTeam] = useState("");

  const [formData, setFormData] = useState({
    old_rencana_kinerja: "",
    rencana_kinerja: "",
    tim_kerja: "",
    ketua_tim_id: currentUser?.id || "",
    assignee_ids: [] as string[],
  });

  const [selectedTeamToAssign, setSelectedTeamToAssign] = useState("");
  const [searchAssignRk, setSearchAssignRk] = useState("");
  const [searchMyRk, setSearchMyRk] = useState("");
  const [filterMyRkTeam, setFilterMyRkTeam] = useState("");

  /* ── Filtered data ─────────────────────── */
  const filteredManagedRKs = useMemo(() =>
    myManagedRKs.filter(
      (rk) =>
        rk.rencana_kinerja?.toLowerCase().includes(searchManaged.toLowerCase()) ||
        rk.tim_kerja?.toLowerCase().includes(searchManaged.toLowerCase())
    ), [myManagedRKs, searchManaged]);

  const filteredAssignees = useMemo(() =>
    allUsers.filter((u) =>
      u.full_name?.toLowerCase().includes(searchAssignee.toLowerCase())
    ), [allUsers, searchAssignee]);

  const filteredRKsForAssign = useMemo(() => {
    if (!selectedTeamToAssign) return [];
    const rksInTeam = allRKs.filter(rk => rk.tim_kerja === selectedTeamToAssign);
    if (!searchAssignRk) return rksInTeam;
    return rksInTeam.filter(rk => rk.rencana_kinerja.toLowerCase().includes(searchAssignRk.toLowerCase()));
  }, [allRKs, selectedTeamToAssign, searchAssignRk]);

  const filteredMyAssignments = useMemo(() => {
    return myAssignments.filter((a) => {
      const rencana_kinerja = a.rk?.rencana_kinerja || "";
      const timKerja = a.rk?.tim_kerja || "Tim Tidak Diketahui";
      
      const matchSearch = rencana_kinerja.toLowerCase().includes(searchMyRk.toLowerCase());
      const matchTeam = filterMyRkTeam ? timKerja === filterMyRkTeam : true;
      
      return matchSearch && matchTeam;
    });
  }, [myAssignments, allRKs, searchMyRk, filterMyRkTeam]);

  const filteredGlobalRKs = useMemo(() => {
    return allRKs.filter((rk) => {
      const matchSearch = rk.rencana_kinerja.toLowerCase().includes(searchGlobal.toLowerCase());
      const matchTeam = filterGlobalTeam ? rk.tim_kerja === filterGlobalTeam : true;
      return matchSearch && matchTeam;
    });
  }, [allRKs, searchGlobal, filterGlobalTeam]);

  /* ── Handlers ──────────────────────────── */
  const handleOpenAddRk = () => {
    setFormData({
      old_rencana_kinerja: "", rencana_kinerja: "", tim_kerja: "",
      ketua_tim_id: currentUser?.id, assignee_ids: [],
    });
    setSearchAssignee("");
    setIsEditing(false);
    setRkModalOpen(true);
  };

  const handleOpenEditRk = (rk: any) => {
    setFormData({
      old_rencana_kinerja: rk.id,
      rencana_kinerja: rk.rencana_kinerja,
      tim_kerja: rk.tim_kerja || "",
      ketua_tim_id: rk.ketua_tim_id,
      assignee_ids: rk.assignments?.map((a: any) => a.user_id) || [],
    });
    setSearchAssignee("");
    setIsEditing(true);
    setRkModalOpen(true);
  };

  const handleToggleAssignee = (userId: string) => {
    setFormData((prev) => ({
      ...prev,
      assignee_ids: prev.assignee_ids.includes(userId)
        ? prev.assignee_ids.filter((id) => id !== userId)
        : [...prev.assignee_ids, userId],
    }));
  };

  const handleSubmitRk = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.rencana_kinerja || !formData.tim_kerja || !formData.ketua_tim_id) {
      toast.error("Harap lengkapi semua field yang wajib.");
      return;
    }
    setLoading(true);
    try {
      if (isEditing) {
        const res = await updateRencanaKinerjaAction(
          formData.old_rencana_kinerja, formData.rencana_kinerja,
          formData.tim_kerja, formData.assignee_ids
        );
        if (res.success) { toast.success("Rencana Kinerja berhasil diperbarui."); setRkModalOpen(false); }
        else throw new Error(res.error);
      } else {
        const res = await addRencanaKinerjaAction(
          formData.rencana_kinerja, formData.tim_kerja,
          formData.ketua_tim_id, formData.assignee_ids
        );
        if (res.success) { toast.success("Rencana Kinerja berhasil ditambahkan."); setRkModalOpen(false); }
        else throw new Error(res.error);
      }
    } catch (err: any) {
      toast.error(err.message || "Terjadi kesalahan");
    } finally { setLoading(false); }
  };

  const handleDeleteRk = (id: string, rkName: string) => {
    setDeleteTarget({ id, name: rkName, type: 'rk' });
    setDeleteConfirmOpen(true);
  };

  const handleSelfAssign = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRkToAssign) return toast.error("Pilih Rencana Kinerja terlebih dahulu.");
    setLoading(true);
    try {
      const res = await assignSelfToRencanaKinerjaAction(selectedRkToAssign);
      if (res.success) {
        toast.success("Berhasil ditambahkan ke daftar RK Saya.");
        setAssignModalOpen(false); 
        setSelectedRkToAssign("");
        setSelectedTeamToAssign("");
        setSearchAssignRk("");
      } else throw new Error(res.error);
    } catch (err: any) { toast.error(err.message || "Gagal menambahkan RK"); }
    finally { setLoading(false); }
  };

  const handleRemoveSelfAssignment = (id: string) => {
    setDeleteTarget({ id, type: 'assignment' });
    setDeleteConfirmOpen(true);
  };

  const executeDelete = async () => {
    if (!deleteTarget) return;
    setLoading(true);
    try {
      if (deleteTarget.type === 'rk') {
        const res = await deleteRencanaKinerjaAction(deleteTarget.id);
        if (res.success) toast.success("Rencana Kinerja dihapus.");
        else throw new Error(res.error);
      } else {
        const res = await removeAssignmentAction(deleteTarget.id);
        if (res.success) toast.success("Berhasil dihapus dari daftar.");
        else throw new Error(res.error);
      }
      setDeleteConfirmOpen(false);
      setDeleteTarget(null);
    } catch (err: any) { 
      toast.error(err.message || "Gagal menghapus"); 
    } finally {
      setLoading(false);
    }
  };

  /* ─────────────────────────────────────────── */
  /*  Render                                      */
  /* ─────────────────────────────────────────── */
  return (
    <>
      <Header />
      <div className="p-5 lg:p-8 space-y-6 animate-fade-in">

        {/* ── KPI Summary ───────────────────── */}
        <div className="flex flex-wrap gap-4 stagger">
          {isKetuaTim && (
            <div className="kpi-card p-4 flex items-center gap-4 w-full sm:w-auto sm:min-w-[240px] pr-8" onClick={() => setActiveTab("managed")} style={{ cursor: 'pointer' }}>
              <div className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: 'var(--primary-soft)' }}>
                <Briefcase size={20} style={{ color: 'var(--primary)' }} />
              </div>
              <div>
                <p className="text-2xl font-bold tabular-nums" style={{ color: 'var(--text-primary)' }}>{myManagedRKs.length}</p>
                <p className="text-[12px] font-medium" style={{ color: 'var(--text-secondary)' }}>RK Tim Saya</p>
              </div>
            </div>
          )}

          <div className="kpi-card p-4 flex items-center gap-4 w-full sm:w-auto sm:min-w-[240px] pr-8" onClick={() => setActiveTab("my_rk")} style={{ cursor: 'pointer' }}>
            <div className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: 'var(--primary-soft)' }}>
              <ClipboardList size={20} style={{ color: 'var(--primary)' }} />
            </div>
            <div>
              <p className="text-2xl font-bold tabular-nums" style={{ color: 'var(--text-primary)' }}>{myAssignments.length}</p>
              <p className="text-[12px] font-medium" style={{ color: 'var(--text-secondary)' }}>RK Saya</p>
            </div>
          </div>

          <div className="kpi-card p-4 flex items-center gap-4 w-full sm:w-auto sm:min-w-[240px] pr-8" onClick={() => setActiveTab("global")} style={{ cursor: 'pointer' }}>
            <div className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: 'var(--primary-soft)' }}>
              <Globe size={20} style={{ color: 'var(--primary)' }} />
            </div>
            <div>
              <p className="text-2xl font-bold tabular-nums" style={{ color: 'var(--text-primary)' }}>{allRKs.length}</p>
              <p className="text-[12px] font-medium" style={{ color: 'var(--text-secondary)' }}>Kamus Global</p>
            </div>
          </div>

        </div>

        {!mounted ? (
          <div className="space-y-4 mt-6">
            <Skeleton className="h-10 w-full max-w-sm rounded-xl" />
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {[1,2,3,4,5,6].map(i => (
                <Skeleton key={i} className="h-32 w-full rounded-2xl" />
              ))}
            </div>
          </div>
        ) : (
          <>
            {/* ── Tab Navigation (filter-bar style) ── */}
            <div className="filter-bar">
          {isKetuaTim && (
            <button
              onClick={() => setActiveTab("managed")}
              className={`filter-btn ${activeTab === "managed" ? "filter-btn-active" : ""}`}
              style={activeTab === "managed" ? { background: 'var(--primary-soft)', color: 'var(--primary)', borderColor: 'var(--primary)' } : undefined}
            >
              <Briefcase size={14} /> Manajemen Tim
            </button>
          )}
          <button
            onClick={() => setActiveTab("my_rk")}
            className={`filter-btn ${activeTab === "my_rk" ? "filter-btn-active" : ""}`}
            style={activeTab === "my_rk" ? { background: 'var(--primary-soft)', color: 'var(--primary)', borderColor: 'var(--primary)' } : undefined}
          >
            <ListTodo size={14} /> RK Saya
          </button>
          <button
            onClick={() => setActiveTab("global")}
            className={`filter-btn ${activeTab === "global" ? "filter-btn-active" : ""}`}
            style={activeTab === "global" ? { background: 'var(--success-soft)', color: '#16A34A', borderColor: '#16A34A' } : undefined}
          >
            <Globe size={14} /> Kamus Global
          </button>
          <button
            onClick={() => setActiveTab("history")}
            className={`filter-btn ${activeTab === "history" ? "filter-btn-active" : ""}`}
            style={activeTab === "history" ? { background: '#fef3c7', color: '#d97706', borderColor: '#d97706' } : undefined}
          >
            <History size={14} /> Histori
          </button>
        </div>

        {/* ════════════════════════════════════════ */}
        {/*  TAB: Manajemen Tim                     */}
        {/* ════════════════════════════════════════ */}
        {isKetuaTim && activeTab === "managed" && (
          <div className="space-y-4">
            {/* Toolbar */}
            <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
              <div className="relative flex-1 w-full sm:max-w-sm">
                <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-secondary)' }} />
                <input
                  type="text"
                  placeholder="Cari RK atau tim kerja..."
                  value={searchManaged}
                  onChange={(e) => setSearchManaged(e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 text-[13px] rounded-xl"
                  style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', color: 'var(--text-primary)' }}
                />
              </div>
              <Button onClick={handleOpenAddRk}>
                <Plus size={16} /> Tambah RK Baru
              </Button>
            </div>

            {/* RK List */}
            {filteredManagedRKs.length === 0 ? (
              <div className="kpi-card text-center py-16 px-6">
                <div className="w-14 h-14 mx-auto mb-4 rounded-xl flex items-center justify-center" style={{ background: 'var(--primary-soft)' }}>
                  <Briefcase size={24} style={{ color: 'var(--primary)' }} />
                </div>
                <p className="font-semibold text-[15px]" style={{ color: 'var(--text-primary)' }}>
                  {searchManaged ? "Tidak ditemukan" : "Belum ada Rencana Kinerja"}
                </p>
                <p className="text-[13px] mt-1" style={{ color: 'var(--text-secondary)' }}>
                  {searchManaged ? "Coba ubah kata pencarian Anda." : 'Klik "Tambah RK Baru" untuk memulai.'}
                </p>
              </div>
            ) : (
              <motion.div layout className="space-y-2 card-list">
                <AnimatePresence>
                  {filteredManagedRKs.map((rk, i) => (
                    <motion.div 
                      key={rk.id || i}
                      layout
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                      className="activity-card flex flex-col sm:flex-row sm:items-center gap-3 p-4 hover:-translate-y-1 hover:shadow-lg transition-all"
                    >
                      {/* Left: Info */}
                    <div className="flex items-start gap-3 flex-1 min-w-0">
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: 'var(--primary-soft)' }}>
                        <ClipboardList size={18} style={{ color: 'var(--primary)' }} />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="font-semibold text-[13px] pr-2 leading-relaxed" style={{ color: 'var(--text-primary)' }}>
                          {rk.rencana_kinerja}
                        </p>
                        <div className="flex flex-wrap items-center gap-2 mt-1">
                          <span className="badge-pill badge-draft text-[11px]">{rk.tim_kerja}</span>
                          {rk.assignments?.length > 0 ? (
                            <span className="badge-pill badge-approved text-[11px]">
                              <Users size={11} /> {rk.assignments.length} anggota
                            </span>
                          ) : (
                            <span className="text-[11px]" style={{ color: 'var(--text-secondary)' }}>Belum ditugaskan</span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Right: Actions */}
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <button
                        onClick={() => handleOpenEditRk(rk)}
                        className="filter-btn text-[12px] py-1.5 px-3"
                        style={{ gap: '4px' }}
                      >
                        <Edit size={13} /> Edit
                      </button>
                      <button
                        onClick={() => handleDeleteRk(rk.id, rk.rencana_kinerja)}
                        className="filter-btn text-[12px] py-1.5 px-3"
                        style={{ gap: '4px', color: 'var(--danger)', borderColor: 'var(--danger)' }}
                      >
                        <Trash2 size={13} /> Hapus
                      </button>
                    </div>
                  </motion.div>
                ))}
                </AnimatePresence>
              </motion.div>
            )}
          </div>
        )}

        {/* ════════════════════════════════════════ */}
        {/*  TAB: RK Saya                           */}
        {/* ════════════════════════════════════════ */}
        {activeTab === "my_rk" && (
          <div className="space-y-4">
            {/* Toolbar */}
            <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
              <div className="flex flex-col sm:flex-row gap-3 w-full sm:max-w-xl">
                {/* Search */}
                <div className="relative flex-1">
                  <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-secondary)' }} />
                  <input
                    type="text"
                    placeholder="Cari RK Saya..."
                    value={searchMyRk}
                    onChange={(e) => setSearchMyRk(e.target.value)}
                    className="w-full pl-9 pr-4 py-2 text-[13px] rounded-xl focus:outline-none"
                    style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', color: 'var(--text-primary)' }}
                  />
                </div>
                {/* Filter Tim */}
                <div className="flex-shrink-0">
                  <select
                    value={filterMyRkTeam}
                    onChange={(e) => setFilterMyRkTeam(e.target.value)}
                    className="w-full px-3 py-2 text-[13px] rounded-xl focus:outline-none"
                    style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', color: 'var(--text-primary)' }}
                  >
                    <option value="">Semua Tim</option>
                    {timKerjaList.map((t, idx) => (
                      <option key={idx} value={t}>{t}</option>
                    ))}
                  </select>
                </div>
              </div>
              <Button onClick={() => {
                setSelectedTeamToAssign("");
                setSearchAssignRk("");
                setSelectedRkToAssign("");
                setAssignModalOpen(true);
              }}>
                <Plus size={16} /> Ambil dari Kamus
              </Button>
            </div>

            {filteredMyAssignments.length === 0 ? (
              <div className="kpi-card text-center py-16 px-6">
                <div className="w-14 h-14 mx-auto mb-4 rounded-xl flex items-center justify-center" style={{ background: 'var(--primary-soft)' }}>
                  <ListTodo size={24} style={{ color: 'var(--primary)' }} />
                </div>
                <p className="font-semibold text-[15px]" style={{ color: 'var(--text-primary)' }}>
                  {searchMyRk || filterMyRkTeam ? "Tidak ditemukan" : "Belum ada Rencana Kinerja"}
                </p>
                <p className="text-[13px] mt-1 max-w-sm mx-auto" style={{ color: 'var(--text-secondary)' }}>
                  {searchMyRk || filterMyRkTeam ? "Coba ubah kata kunci atau filter tim Anda." : "Klik \"Ambil dari Kamus\" atau hubungi Ketua Tim Anda untuk penugasan."}
                </p>
              </div>
            ) : (
              <motion.div layout className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 card-list">
                <AnimatePresence>
                  {filteredMyAssignments.map((a, i) => {
                    const rencana_kinerja = a.rk?.rencana_kinerja || "";
                    const timKerja = a.rk?.tim_kerja || "Tim Tidak Diketahui";

                    return (
                      <motion.div 
                        key={a.id || i} 
                        layout
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className="activity-card flex flex-col p-4 relative group hover:-translate-y-1 hover:shadow-xl transition-all"
                      >
                        {/* Info Section */}
                      <div className="flex items-start gap-3 flex-1">
                        <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: 'var(--primary-soft)' }}>
                          <ClipboardList size={18} style={{ color: 'var(--primary)' }} />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="font-semibold text-[13px] leading-relaxed line-clamp-3 pr-6" style={{ color: 'var(--text-primary)' }}>
                            {rencana_kinerja}
                          </p>
                        </div>
                      </div>

                      {/* Remove Button (Hover/Absolute) */}
                      <button
                        onClick={() => handleRemoveSelfAssignment(a.id)}
                        className="absolute top-4 right-4 w-7 h-7 rounded-md flex items-center justify-center transition-opacity opacity-0 group-hover:opacity-100 hover:bg-red-50 text-[var(--text-tertiary)] hover:text-red-500"
                        title="Lepas dari daftar RK Saya"
                      >
                        <X size={15} />
                      </button>

                      {/* Bottom Meta */}
                      <div className="mt-4 pt-3 flex flex-col gap-2" style={{ borderTop: '1px solid var(--border-soft)' }}>
                        <div>
                          <span className="badge-pill badge-draft text-[11px] truncate max-w-full">
                            {timKerja}
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5 mt-1">
                          {a.assigned_by_user ? (
                            <>
                              <div className="w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-bold flex-shrink-0"
                                style={{ background: 'var(--primary-soft)', color: 'var(--primary)' }}>
                                {a.assigned_by_user.full_name[0].toUpperCase()}
                              </div>
                              <span className="text-[11px] truncate" style={{ color: 'var(--text-secondary)' }}>
                                Ditugaskan: {a.assigned_by_user.full_name}
                              </span>
                            </>
                          ) : (
                            <>
                              <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0"
                                style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)' }}>
                                <Globe size={10} style={{ color: 'var(--text-secondary)' }} />
                              </div>
                              <span className="text-[11px] truncate" style={{ color: 'var(--text-secondary)' }}>
                                Sumber: Kamus Global
                              </span>
                            </>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
                </AnimatePresence>
              </motion.div>
            )}
          </div>
        )}

        {/* ════════════════════════════════════════ */}
        {/*  TAB: Kamus Global                      */}
        {/* ════════════════════════════════════════ */}
        {activeTab === "global" && (
          <div className="space-y-4 animate-fade-in">
            {/* Toolbar */}
            <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
              <div className="flex flex-col sm:flex-row gap-3 w-full sm:max-w-xl">
                {/* Search */}
                <div className="relative flex-1">
                  <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-secondary)' }} />
                  <input
                    type="text"
                    placeholder="Cari di Kamus Global..."
                    value={searchGlobal}
                    onChange={(e) => setSearchGlobal(e.target.value)}
                    className="w-full pl-9 pr-4 py-2 text-[13px] rounded-xl focus:outline-none"
                    style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', color: 'var(--text-primary)' }}
                  />
                </div>
                {/* Filter Tim */}
                <div className="flex-shrink-0">
                  <select
                    value={filterGlobalTeam}
                    onChange={(e) => setFilterGlobalTeam(e.target.value)}
                    className="w-full px-3 py-2 text-[13px] rounded-xl focus:outline-none"
                    style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', color: 'var(--text-primary)' }}
                  >
                    <option value="">Semua Tim</option>
                    {timKerjaList.map((t, idx) => (
                      <option key={idx} value={t}>{t}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {filteredGlobalRKs.length === 0 ? (
              <div className="kpi-card text-center py-16 px-6">
                <div className="w-14 h-14 mx-auto mb-4 rounded-xl flex items-center justify-center" style={{ background: 'var(--primary-soft)' }}>
                  <Globe size={24} style={{ color: 'var(--primary)' }} />
                </div>
                <p className="font-semibold text-[15px]" style={{ color: 'var(--text-primary)' }}>
                  Tidak ditemukan
                </p>
                <p className="text-[13px] mt-1 max-w-sm mx-auto" style={{ color: 'var(--text-secondary)' }}>
                  Coba ubah kata kunci atau filter tim Anda.
                </p>
              </div>
            ) : (
              <motion.div layout className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 card-list">
                <AnimatePresence>
                  {filteredGlobalRKs.map((rk, i) => (
                    <motion.div 
                      key={rk.id || i} 
                      layout
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                      className="activity-card flex flex-col p-4 relative hover:-translate-y-1 hover:shadow-xl transition-all"
                    >
                      <div className="flex items-start gap-3 flex-1">
                        <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: 'var(--primary-soft)' }}>
                          <Globe size={18} style={{ color: 'var(--primary)' }} />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="font-semibold text-[13px] leading-relaxed line-clamp-3" style={{ color: 'var(--text-primary)' }}>
                            {rk.rencana_kinerja}
                          </p>
                        </div>
                      </div>

                      <div className="mt-4 pt-3 flex flex-col gap-2" style={{ borderTop: '1px solid var(--border-soft)' }}>
                        <div>
                          <span className="badge-pill badge-draft text-[11px] truncate max-w-full">
                            {rk.tim_kerja || "Tim Tidak Diketahui"}
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </motion.div>
            )}
          </div>
        )}
        </>
        )}
      </div>

      {/* ════════════════════════════════════════ */}
      {/*  MODAL: Add / Edit RK                    */}
      {/* ════════════════════════════════════════ */}
      <Dialog open={rkModalOpen} onClose={() => setRkModalOpen(false)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{isEditing ? "Edit Rencana Kinerja" : "Tambah Rencana Kinerja Baru"}</DialogTitle>
            <DialogDescription>
              {isEditing ? "Perbarui informasi dan penugasan anggota." : "Buat RK baru dan tugaskan anggota tim sekaligus."}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmitRk} className="space-y-5 px-6 pb-2">
            <div className="space-y-1.5">
              <label className="text-[13px] font-medium" style={{ color: 'var(--text-primary)' }}>
                Nama Rencana Kinerja <span style={{ color: 'var(--danger)' }}>*</span>
              </label>
              <Input required placeholder="Contoh: Survei Angkatan Kerja Nasional"
                value={formData.rencana_kinerja}
                onChange={(e) => setFormData({ ...formData, rencana_kinerja: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <label className="text-[13px] font-medium" style={{ color: 'var(--text-primary)' }}>
                  Tim Kerja <span style={{ color: 'var(--danger)' }}>*</span>
                </label>
                <Input required list="timKerjaList" placeholder="Ketik atau pilih tim..."
                  value={formData.tim_kerja}
                  onChange={(e) => setFormData({ ...formData, tim_kerja: e.target.value })}
                />
                <datalist id="timKerjaList">
                  {timKerjaList.map((t, i) => <option key={i} value={t} />)}
                </datalist>
              </div>
              <div className="space-y-1.5">
                <label className="text-[13px] font-medium" style={{ color: 'var(--text-primary)' }}>
                  Ketua Tim Penilai <span style={{ color: 'var(--danger)' }}>*</span>
                </label>
                <Select
                  value={formData.ketua_tim_id}
                  onChange={(e) => setFormData({ ...formData, ketua_tim_id: e.target.value })}
                  options={allUsers.filter(u => ["ketua_tim", "pimpinan", "admin"].includes(u.role)).map(u => ({ value: u.id, label: u.full_name }))}
                  placeholder="Pilih Ketua Tim"
                />
              </div>
            </div>

            {/* Assignees */}
            <div className="space-y-3 pt-3" style={{ borderTop: '1px solid var(--border-soft)' }}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[13px] font-semibold" style={{ color: 'var(--text-primary)' }}>Penugasan Anggota</p>
                  <p className="text-[11px]" style={{ color: 'var(--text-secondary)' }}>Opsional — pilih pegawai yang mengerjakan RK ini.</p>
                </div>
                <span className="badge-pill badge-submitted text-[11px]">{formData.assignee_ids.length} terpilih</span>
              </div>

              <div className="relative">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-secondary)' }} />
                <input type="text" placeholder="Cari pegawai..."
                  value={searchAssignee} onChange={(e) => setSearchAssignee(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 text-[13px] rounded-lg"
                  style={{ border: '1px solid var(--border)', background: 'var(--bg-base)' }}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 max-h-[200px] overflow-y-auto p-1">
                {filteredAssignees.map((user) => {
                  const isSelected = formData.assignee_ids.includes(user.id);
                  return (
                    <div key={user.id} onClick={() => handleToggleAssignee(user.id)}
                      className="flex items-center gap-2.5 px-3 py-2 rounded-lg cursor-pointer text-[13px] transition-all"
                      style={isSelected
                        ? { background: 'var(--primary-soft)', color: 'var(--primary)', border: '1px solid rgba(37,99,235,0.2)' }
                        : { border: '1px solid transparent' }
                      }
                    >
                      {isSelected
                        ? <CheckCircle2 size={16} style={{ color: 'var(--primary)' }} />
                        : <div className="w-4 h-4 rounded" style={{ border: '1.5px solid var(--border)' }} />
                      }
                      <span className="truncate">{user.full_name}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setRkModalOpen(false)}>Batal</Button>
              <Button type="submit" loading={loading}>
                {loading ? "Menyimpan..." : isEditing ? "Perbarui" : "Simpan"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* ════════════════════════════════════════ */}
      {/*  MODAL: Self-assign RK                   */}
      {/* ════════════════════════════════════════ */}
      <Dialog open={assignModalOpen} onClose={() => setAssignModalOpen(false)}>
        <DialogContent className="max-w-2xl max-h-[90vh] flex flex-col">
          <DialogHeader>
            <DialogTitle>Ambil Rencana Kinerja</DialogTitle>
            <DialogDescription>Pilih tim kerja terlebih dahulu, kemudian cari dan pilih RK yang ingin ditambahkan ke daftar Anda.</DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-5 px-6 pb-2 overflow-y-auto min-h-[300px]">
            {/* Step 1: Pilih Tim */}
            <div className="space-y-2">
              <label className="text-[13px] font-medium" style={{ color: 'var(--text-primary)' }}>1. Pilih Tim Kerja</label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {timKerjaList.map((team, idx) => {
                  const isSelected = selectedTeamToAssign === team;
                  return (
                    <div
                      key={idx}
                      onClick={() => { setSelectedTeamToAssign(team); setSelectedRkToAssign(""); }}
                      className="p-3 rounded-lg cursor-pointer text-[12px] transition-all flex items-start justify-between gap-2 h-full"
                      style={isSelected
                        ? { background: 'var(--primary-soft)', color: 'var(--primary)', border: '1px solid rgba(37,99,235,0.3)', fontWeight: 600 }
                        : { border: '1px solid var(--border)', background: 'var(--bg-base)' }
                      }
                    >
                      <span className="leading-snug text-left">{team}</span>
                      {isSelected && <CheckCircle2 size={14} className="flex-shrink-0 mt-0.5" />}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Step 2: Pilih RK */}
            {selectedTeamToAssign && (
              <div className="space-y-3 pt-3" style={{ borderTop: '1px solid var(--border-soft)' }}>
                <label className="text-[13px] font-medium" style={{ color: 'var(--text-primary)' }}>2. Pilih Rencana Kinerja</label>
                
                <div className="relative">
                  <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-secondary)' }} />
                  <input type="text" placeholder="Ketik untuk mencari RK di tim ini..."
                    value={searchAssignRk} onChange={(e) => setSearchAssignRk(e.target.value)}
                    className="w-full pl-9 pr-4 py-2 text-[13px] rounded-lg focus:outline-none"
                    style={{ border: '1px solid var(--border)', background: '#fff' }}
                  />
                </div>

                <div className="flex flex-col gap-2 max-h-[200px] overflow-y-auto pr-1">
                  {filteredRKsForAssign.length === 0 ? (
                    <p className="text-[12px] italic text-center py-4" style={{ color: 'var(--text-secondary)' }}>
                      {searchAssignRk ? "RK tidak ditemukan." : "Tidak ada RK di tim ini."}
                    </p>
                  ) : (
                    filteredRKsForAssign.map((rk, idx) => {
                      const isSelected = selectedRkToAssign === rk.id;
                      return (
                        <div key={idx} onClick={() => setSelectedRkToAssign(rk.id)}
                          className="flex items-start gap-3 p-3 rounded-xl cursor-pointer transition-all"
                          style={isSelected
                            ? { background: 'var(--primary-soft)', border: '1px solid rgba(37,99,235,0.2)' }
                            : { border: '1px solid var(--border)', background: '#fff' }
                          }
                        >
                          <div className="mt-0.5">
                            {isSelected
                              ? <CheckCircle2 size={16} style={{ color: 'var(--primary)' }} />
                              : <div className="w-4 h-4 rounded-full" style={{ border: '1.5px solid var(--border)' }} />
                            }
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-[13px] leading-snug" style={{ color: isSelected ? 'var(--primary)' : 'var(--text-primary)', fontWeight: isSelected ? 600 : 400 }}>
                              {rk.rencana_kinerja}
                            </p>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            )}
          </div>
          
          <DialogFooter className="px-6 pb-6 pt-2 mt-auto">
            <Button type="button" variant="outline" onClick={() => setAssignModalOpen(false)}>Batal</Button>
            <Button type="button" onClick={handleSelfAssign} loading={loading} disabled={!selectedRkToAssign}>
              {loading ? "Menambahkan..." : "Tambahkan ke RK Saya"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ════════════════════════════════════════ */}
      {/*  MODAL: Delete Confirmation              */}
      {/* ════════════════════════════════════════ */}
      <Dialog open={deleteConfirmOpen} onClose={() => setDeleteConfirmOpen(false)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              {deleteTarget?.type === 'rk' ? 'Hapus Rencana Kinerja?' : 'Hapus dari Daftar?'}
            </DialogTitle>
            <DialogDescription>
              {deleteTarget?.type === 'rk' 
                ? `Apakah Anda yakin ingin menghapus Rencana Kinerja "${deleteTarget?.name}"? Semua penugasan terkait juga akan dihapus permanen.`
                : 'Apakah Anda yakin ingin menghapus RK ini dari daftar RK Saya?'
              }
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-4">
            <Button type="button" variant="outline" onClick={() => setDeleteConfirmOpen(false)} disabled={loading}>
              Batal
            </Button>
            <Button type="button" onClick={executeDelete} disabled={loading} style={{ background: 'var(--danger)', color: 'white' }}>
              {loading ? "Menghapus..." : "Hapus"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
