"use client";

import { useState, useMemo, useEffect } from "react";
import {
  Plus, Edit, Trash2, CheckCircle2, Search,
  UserPlus, Briefcase, ListTodo, X, Users, ClipboardList, Globe, History, ChevronLeft
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
  teamAuditLogs?: any[];
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
  teamAuditLogs = [],
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
  const [selectedRkToAssign, setSelectedRkToAssign] = useState<string[]>([]);
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
  
  const [sortManaged, setSortManaged] = useState<"newest" | "oldest" | "az" | "za">("newest");
  const [sortMyRk, setSortMyRk] = useState<"newest" | "oldest" | "az" | "za">("newest");

  const [historyTab, setHistoryTab] = useState<"saya" | "tim">("saya");
  const [searchHistory, setSearchHistory] = useState("");

  /* ── Filtered data ─────────────────────── */
  const filteredManagedRKs = useMemo(() => {
    let result = myManagedRKs.filter(
      (rk) =>
        rk.rencana_kinerja?.toLowerCase().includes(searchManaged.toLowerCase()) ||
        rk.tim_kerja?.toLowerCase().includes(searchManaged.toLowerCase())
    );

    result.sort((a, b) => {
      if (sortManaged === "az") {
        return (a.rencana_kinerja || "").localeCompare(b.rencana_kinerja || "");
      } else if (sortManaged === "za") {
        return (b.rencana_kinerja || "").localeCompare(a.rencana_kinerja || "");
      } else if (sortManaged === "oldest") {
        return new Date(a.created_at || 0).getTime() - new Date(b.created_at || 0).getTime();
      } else {
        return new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime();
      }
    });

    return result;
  }, [myManagedRKs, searchManaged, sortManaged]);

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
    let result = myAssignments.filter((a) => {
      const rencana_kinerja = a.rk?.rencana_kinerja || "";
      const timKerja = a.rk?.tim_kerja || "Tim Tidak Diketahui";
      
      const matchSearch = rencana_kinerja.toLowerCase().includes(searchMyRk.toLowerCase());
      const matchTeam = filterMyRkTeam ? timKerja === filterMyRkTeam : true;
      
      return matchSearch && matchTeam;
    });

    result.sort((a, b) => {
      if (sortMyRk === "az") {
        return (a.rk?.rencana_kinerja || "").localeCompare(b.rk?.rencana_kinerja || "");
      } else if (sortMyRk === "za") {
        return (b.rk?.rencana_kinerja || "").localeCompare(a.rk?.rencana_kinerja || "");
      } else if (sortMyRk === "oldest") {
        return new Date(a.created_at || 0).getTime() - new Date(b.created_at || 0).getTime();
      } else {
        return new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime();
      }
    });

    return result;
  }, [myAssignments, allRKs, searchMyRk, filterMyRkTeam, sortMyRk]);

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
    if (!selectedRkToAssign || selectedRkToAssign.length === 0) return toast.error("Pilih Rencana Kinerja terlebih dahulu.");
    setLoading(true);
    try {
      const res = await assignSelfToRencanaKinerjaAction(selectedRkToAssign);
      if (res.success) {
        toast.success(`Berhasil menambahkan ${selectedRkToAssign.length} RK ke daftar Anda.`);
        setAssignModalOpen(false); 
        setSelectedRkToAssign([]);
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
              <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                <div className="relative flex-1 w-full sm:w-64">
                  <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-secondary)' }} />
                  <input
                    type="text"
                    placeholder="Cari RK atau tim kerja..."
                    value={searchManaged}
                    onChange={(e) => setSearchManaged(e.target.value)}
                    className="w-full pl-9 pr-4 py-2 text-[13px] rounded-xl h-[42px]"
                    style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', color: 'var(--text-primary)' }}
                  />
                </div>
                <div className="w-full sm:w-36">
                  <Select
                    value={sortManaged}
                    onChange={(e) => setSortManaged(e.target.value as any)}
                    className="h-[42px] py-0 text-[13px] bg-[var(--bg-secondary)]"
                    options={[
                      { label: 'Terbaru', value: 'newest' },
                      { label: 'Terlama', value: 'oldest' },
                      { label: 'A - Z', value: 'az' },
                      { label: 'Z - A', value: 'za' }
                    ]}
                  />
                </div>
              </div>
              <Button onClick={handleOpenAddRk} className="w-full sm:w-auto h-[42px] text-[13px]">
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
              <div className="flex flex-col sm:flex-row gap-3 w-full sm:max-w-2xl">
                {/* Search */}
                <div className="relative flex-1">
                  <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-secondary)' }} />
                  <input
                    type="text"
                    placeholder="Cari RK Saya..."
                    value={searchMyRk}
                    onChange={(e) => setSearchMyRk(e.target.value)}
                    className="w-full pl-9 pr-4 py-2 text-[13px] rounded-xl focus:outline-none h-[42px]"
                    style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', color: 'var(--text-primary)' }}
                  />
                </div>
                {/* Filter Tim */}
                <div className="flex-shrink-0 w-full sm:w-40">
                  <Select
                    value={filterMyRkTeam}
                    onChange={(e) => setFilterMyRkTeam(e.target.value as any)}
                    className="h-[42px] py-0 text-[13px] bg-[var(--bg-secondary)]"
                    options={[
                      { label: 'Semua Tim', value: '' },
                      ...timKerjaList.map((t) => ({ label: t, value: t }))
                    ]}
                  />
                </div>
                {/* Sort */}
                <div className="w-full sm:w-36">
                  <Select
                    value={sortMyRk}
                    onChange={(e) => setSortMyRk(e.target.value as any)}
                    className="h-[42px] py-0 text-[13px] bg-[var(--bg-secondary)]"
                    options={[
                      { label: 'Terbaru', value: 'newest' },
                      { label: 'Terlama', value: 'oldest' },
                      { label: 'A - Z', value: 'az' },
                      { label: 'Z - A', value: 'za' }
                    ]}
                  />
                </div>
              </div>
              <Button onClick={() => {
                setSelectedTeamToAssign("");
                setSearchAssignRk("");
                setSelectedRkToAssign([]);
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

        {/* ════════════════════════════════════════ */}
        {/*  TAB: History                           */}
        {/* ════════════════════════════════════════ */}
        {activeTab === "history" && (
          <div className="space-y-6 animate-fade-in">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-2">
              <h2 className="text-[16px] font-bold flex items-center gap-2 text-slate-800">
                <History size={20} className="text-orange-500" /> Histori Aktivitas
              </h2>
              <div className="relative w-full sm:w-64">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Cari nama pegawai atau aktivitas..."
                  className="w-full pl-9 pr-4 py-2 text-[13px] rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all bg-white"
                  value={searchHistory}
                  onChange={(e) => setSearchHistory(e.target.value)}
                />
              </div>
            </div>

            {isKetuaTim && (
              <div className="flex p-1 bg-slate-100/80 rounded-xl w-full sm:w-fit">
                <button
                  onClick={() => setHistoryTab("saya")}
                  className={`flex-1 sm:flex-none px-6 py-2 rounded-lg text-[13px] font-medium transition-all duration-200 flex items-center justify-center gap-2 ${
                    historyTab === "saya" 
                      ? "bg-white text-blue-600 shadow-sm" 
                      : "text-slate-500 hover:text-slate-700 hover:bg-slate-200/50"
                  }`}
                >
                  <UserPlus size={16} /> Aktivitas Saya
                </button>
                <button
                  onClick={() => setHistoryTab("tim")}
                  className={`flex-1 sm:flex-none px-6 py-2 rounded-lg text-[13px] font-medium transition-all duration-200 flex items-center justify-center gap-2 ${
                    historyTab === "tim" 
                      ? "bg-white text-orange-600 shadow-sm" 
                      : "text-slate-500 hover:text-slate-700 hover:bg-slate-200/50"
                  }`}
                >
                  <Users size={16} /> Aktivitas Tim
                </button>
              </div>
            )}
            
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
              {(() => {
                const sourceLogs = (isKetuaTim && historyTab === "tim") ? teamAuditLogs : auditLogs;
                
                // Filter logs based on search
                const filteredLogs = (sourceLogs || []).filter((log: any) => {
                  if (!searchHistory) return true;
                  const search = searchHistory.toLowerCase();
                  const actorName = (log.user?.full_name || "Sistem").toLowerCase();
                  const rkName = (log.new_data?.rencana_kinerja || log.old_data?.rencana_kinerja || log.entity_id || "").toLowerCase();
                  const actionText = (log.action || "").toLowerCase();
                  return actorName.includes(search) || rkName.includes(search) || actionText.includes(search);
                });

                if (filteredLogs.length === 0) {
                  return (
                    <div className="text-center py-12 bg-[var(--bg-secondary)] rounded-xl border border-dashed border-[var(--border)]">
                      <History className="mx-auto h-8 w-8 text-slate-300 mb-3" />
                      <p className="text-slate-500 text-[13px]">Belum ada histori aktivitas yang sesuai.</p>
                    </div>
                  );
                }

                return (
                  <div className="relative border-l-2 border-slate-100 ml-3.5 space-y-8">
                    {filteredLogs.map((log: any) => {
                      let actorName = log.user?.full_name || "Sistem";
                      let roleLabel = log.user?.role === 'ketua_tim' ? 'Ketua Tim' : log.user?.role === 'anggota' ? 'Pegawai' : log.user?.role;
                      
                      let actionText = "";
                      let iconColor = "#94a3b8"; // slate-400
                      let iconBg = "#f1f5f9"; // slate-100
                      let detailText = log.entity_type;

                      const rkName = log.new_data?.rencana_kinerja || log.old_data?.rencana_kinerja || log.entity_id;
                      const timName = log.new_data?.tim_kerja || log.old_data?.tim_kerja || "";

                      if (log.action === 'rk_created') {
                        actionText = `membuat RK baru`;
                        iconColor = "#16a34a"; // green-600
                        iconBg = "#dcfce7"; // green-100
                        detailText = `${rkName} (${timName})`;
                      } else if (log.action === 'rk_updated') {
                        actionText = `mengubah RK`;
                        iconColor = "#0284c7"; // sky-600
                        iconBg = "#e0f2fe"; // sky-100
                        detailText = `Menjadi: ${rkName}`;
                      } else if (log.action === 'rk_deleted') {
                        actionText = `menghapus RK`;
                        iconColor = "#dc2626"; // red-600
                        iconBg = "#fee2e2"; // red-100
                        detailText = `${rkName}`;
                      } else if (log.action === 'rk_self_assigned') {
                        actionText = `mengambil RK ke daftarnya`;
                        iconColor = "#d97706"; // amber-600
                        iconBg = "#fef3c7"; // amber-100
                        detailText = `${rkName}`;
                      } else if (log.action === 'rk_assigned') {
                        const targetName = log.new_data?.assignee_name || "Pegawai";
                        actionText = `menugaskan RK kepada ${targetName}`;
                        iconColor = "#8b5cf6"; // violet-500
                        iconBg = "#ede9fe"; // violet-100
                        detailText = `${rkName}`;
                      } else if (log.action === 'rk_unassigned') {
                        const targetName = log.old_data?.assignee_name;
                        if (targetName) {
                          actionText = `menghapus penugasan RK dari ${targetName}`;
                        } else {
                          actionText = `menghapus RK dari daftarnya`;
                        }
                        iconColor = "#64748b"; // slate-500
                        iconBg = "#f1f5f9"; // slate-100
                        detailText = `${rkName}`;
                      } else {
                        actionText = `melakukan aksi ${log.action}`;
                      }

                      return (
                        <div key={log.id} className="relative pl-6 group">
                          <span 
                            className="absolute -left-[11px] top-1 flex h-[22px] w-[22px] items-center justify-center rounded-full ring-4 ring-white transition-transform group-hover:scale-110" 
                            style={{ backgroundColor: iconBg }}
                          >
                            <div className="h-2 w-2 rounded-full" style={{ backgroundColor: iconColor }} />
                          </span>
                          <div className="flex flex-col gap-1.5 bg-[var(--bg-secondary)] p-3.5 rounded-xl border border-[var(--border)] hover:border-[var(--border-hover)] hover:bg-[var(--bg-hover)] transition-colors">
                            <div className="flex justify-between items-start gap-4">
                              <p className="text-[13px] leading-relaxed" style={{ color: 'var(--text-primary)' }}>
                                <span className="font-bold">{actorName}</span>
                                {roleLabel && <span className="text-slate-500 font-medium mx-1">({roleLabel})</span>}
                                <span>{actionText}</span>
                              </p>
                              <span className="text-[11px] font-medium text-slate-400 whitespace-nowrap bg-[var(--bg-base)] px-2 py-1 rounded-md border border-[var(--border)] shadow-sm">
                                {new Date(log.created_at).toLocaleString('id-ID', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                              </span>
                            </div>
                            <p className="text-[12px] font-medium text-slate-700 bg-white p-2.5 rounded-lg border border-slate-100 mt-1 shadow-sm leading-relaxed">
                              {detailText}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                );
              })()}
            </div>
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
        <DialogContent className="max-w-2xl max-h-[90vh] flex flex-col p-0 overflow-hidden">
          <div className="px-6 pt-6 pb-4 border-b border-[var(--border)]">
            <DialogTitle className="text-xl">Ambil Rencana Kinerja</DialogTitle>
            <DialogDescription className="mt-1">
              {!selectedTeamToAssign 
                ? "Pilih tim kerja terlebih dahulu." 
                : `Pilih RK untuk tim: ${selectedTeamToAssign}`}
            </DialogDescription>
          </div>
          <div className="flex flex-col px-6 py-4 overflow-y-auto min-h-[400px]">
            {!selectedTeamToAssign ? (
              /* Step 1: Pilih Tim */
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {timKerjaList.map((team, idx) => (
                  <div
                    key={idx}
                    onClick={() => { setSelectedTeamToAssign(team); setSelectedRkToAssign([]); }}
                    className="p-4 rounded-xl cursor-pointer text-[13px] transition-all flex items-center justify-center text-center h-full hover:-translate-y-1 hover:shadow-md"
                    style={{ border: '1px solid var(--border)', background: 'var(--bg-base)', fontWeight: 500, color: 'var(--text-primary)' }}
                  >
                    <span>{team}</span>
                  </div>
                ))}
              </div>
            ) : (
              /* Step 2: Pilih RK */
              <div className="space-y-4 flex-1 flex flex-col">
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" onClick={() => { setSelectedTeamToAssign(""); setSelectedRkToAssign([]); }} className="h-8 px-3 rounded-lg" style={{ color: 'var(--text-secondary)' }}>
                    <ChevronLeft size={16} className="mr-1" /> Kembali ke Tim
                  </Button>
                </div>
                
                <div className="relative">
                  <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-secondary)' }} />
                  <input type="text" placeholder={`Cari RK di ${selectedTeamToAssign}...`}
                    value={searchAssignRk} onChange={(e) => setSearchAssignRk(e.target.value)}
                    className="w-full pl-9 pr-4 py-2.5 text-[13px] rounded-xl focus:outline-none"
                    style={{ border: '1px solid var(--border)', background: 'var(--bg-secondary)', color: 'var(--text-primary)' }}
                  />
                </div>

                <div className="flex flex-col gap-2 flex-1 overflow-y-auto pr-1 pb-4">
                  {filteredRKsForAssign.length === 0 ? (
                    <p className="text-[12px] italic text-center py-8" style={{ color: 'var(--text-secondary)' }}>
                      {searchAssignRk ? "RK tidak ditemukan." : "Tidak ada RK di tim ini."}
                    </p>
                  ) : (
                    filteredRKsForAssign.map((rk, idx) => {
                      const isSelected = selectedRkToAssign.includes(rk.id);
                      return (
                        <div key={idx} onClick={() => {
                          if (isSelected) {
                            setSelectedRkToAssign(prev => prev.filter(id => id !== rk.id));
                          } else {
                            setSelectedRkToAssign(prev => [...prev, rk.id]);
                          }
                        }}
                          className="flex items-start gap-3 p-3.5 rounded-xl cursor-pointer transition-all hover:shadow-sm"
                          style={isSelected
                            ? { background: 'var(--primary-soft)', border: '1px solid rgba(37,99,235,0.2)' }
                            : { border: '1px solid var(--border)', background: 'var(--bg-secondary)' }
                          }
                        >
                          <div className="mt-0.5">
                            {isSelected
                              ? <CheckCircle2 size={18} style={{ color: 'var(--primary)' }} />
                              : <div className="w-[18px] h-[18px] rounded-full" style={{ border: '2px solid var(--border)' }} />
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
          
          <DialogFooter className="px-6 py-4 border-t border-[var(--border)] bg-[var(--bg-secondary)] mt-auto">
            <Button type="button" variant="outline" onClick={() => setAssignModalOpen(false)}>Batal</Button>
            <Button type="button" onClick={handleSelfAssign} loading={loading} disabled={selectedRkToAssign.length === 0}>
              {loading ? "Menambahkan..." : selectedRkToAssign.length > 0 ? `Tambahkan ${selectedRkToAssign.length} RK` : "Tambahkan ke RK Saya"}
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
