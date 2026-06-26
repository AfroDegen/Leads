'use client';

import React, { useState, useEffect } from 'react';
import { 
  Building2, Plus, Search, Filter, RefreshCw, ChevronRight, 
  Phone, Mail, Globe, MapPin, Calendar, Clock, AlertCircle, X, CheckCircle2 
} from 'lucide-react';

type LeadStatus = 'New' | 'Researching' | 'Contacted' | 'Replied' | 'Qualified' | 'Demo Scheduled' | 'Proposal Sent' | 'Negotiating' | 'Won' | 'Lost';
type LeadPriority = 'Low' | 'Medium' | 'High' | 'Critical';

interface Lead {
  id: string;
  company_name: string;
  industry: string;
  state: string;
  website: string;
  phone: string;
  email: string;
  contact_name?: string;
  lead_source: string;
  status: LeadStatus;
  priority: LeadPriority;
  notes?: string;
  next_follow_up_date?: string;
  created_at: string;
}

export default function LeadsDashboard() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [priorityFilter, setPriorityFilter] = useState<string>('All');
  const [showAddModal, setShowAddModal] = useState(false);

  const [newLeadForm, setNewLeadForm] = useState({
    company_name: '', industry: '', state: '', website: '', phone: '', email: '', contact_name: '', lead_source: 'Outreach', priority: 'Medium' as LeadPriority, notes: ''
  });

  useEffect(() => {
    const demoLeads: Lead[] = [
      {
        id: '1',
        company_name: 'Apex HVAC Services',
        industry: 'Plumbing & Mechanical',
        state: 'TX',
        website: 'apexhvac.com',
        phone: '+1 555 234 5678',
        email: 'ops@apexhvac.com',
        contact_name: 'Dave Miller',
        lead_source: 'Cold Outreach',
        status: 'New',
        priority: 'High',
        notes: 'Needs dynamic inbound responder deployment model verified.',
        created_at: new Date().toISOString()
      },
      {
        id: '2',
        company_name: 'Rooter King Group',
        industry: 'Home Services',
        state: 'CA',
        website: 'rooterking.io',
        phone: '+1 555 987 6543',
        email: 'info@rooterking.io',
        lead_source: 'Inbound Scraping',
        status: 'Contacted',
        priority: 'Critical',
        notes: 'Spoke briefly on WhatsApp. Following up with proposal deck.',
        created_at: new Date().toISOString()
      }
    ];
    setLeads(demoLeads);
    setLoading(false);
  }, []);

  const metrics = {
    total: leads.length,
    new: leads.filter(l => l.status === 'New').length,
    contacted: leads.filter(l => l.status === 'Contacted').length,
    qualified: leads.filter(l => l.status === 'Qualified').length,
    demo: leads.filter(l => l.status === 'Demo Scheduled').length,
    won: leads.filter(l => l.status === 'Won').length,
  };

  const filteredLeads = leads.filter(lead => {
    const matchesSearch = lead.company_name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          (lead.industry && lead.industry.toLowerCase().includes(searchQuery.toLowerCase())) ||
                          (lead.state && lead.state.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesStatus = statusFilter === 'All' || lead.status === statusFilter;
    const matchesPriority = priorityFilter === 'All' || lead.priority === priorityFilter;
    return matchesSearch && matchesStatus && matchesPriority;
  });

  const handleCreateLead = (e: React.FormEvent) => {
    e.preventDefault();
    const created: Lead = {
      id: Math.random().toString(),
      ...newLeadForm,
      status: 'New',
      created_at: new Date().toISOString()
    };
    setLeads([created, ...leads]);
    setShowAddModal(false);
    setNewLeadForm({ company_name: '', industry: '', state: '', website: '', phone: '', email: '', contact_name: '', lead_source: 'Outreach', priority: 'Medium', notes: '' });
  };

  const updateStatus = (id: string, nextStatus: LeadStatus) => {
    setLeads(leads.map(l => l.id === id ? { ...l, status: nextStatus } : l));
    if (selectedLead && selectedLead.id === id) {
      setSelectedLead({ ...selectedLead, status: nextStatus });
    }
  };

  return (
    <div class="max-w-md mx-auto px-4 pt-4 relative">
      <header class="flex items-center justify-between mb-5 sticky top-0 bg-neutral-950/80 backdrop-blur-md py-2 z-20">
        <div class="flex items-center gap-2">
          <div class="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center">
            <Building2 class="w-4 h-4 text-white" />
          </div>
          <span class="text-base font-semibold tracking-tight text-white">B&F Leads OS</span>
        </div>
        <button 
          onClick={() => setShowAddModal(true)}
          class="h-10 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 active:scale-95 text-xs font-medium text-white transition-all flex items-center gap-1.5 shadow-lg shadow-blue-600/10"
        >
          <Plus class="w-4 h-4" /> Add Lead
        </button>
      </header>

      <section class="grid grid-cols-3 gap-2.5 mb-5">
        <div class="p-3 bg-neutral-900 border border-white/5 rounded-xl">
          <p class="text-[10px] uppercase font-semibold text-neutral-400 tracking-wider">Total</p>
          <p class="text-xl font-semibold text-white mt-0.5">{metrics.total}</p>
        </div>
        <div class="p-3 bg-blue-950/30 border border-blue-500/10 rounded-xl">
          <p class="text-[10px] uppercase font-semibold text-blue-400 tracking-wider">New</p>
          <p class="text-xl font-semibold text-blue-400 mt-0.5">{metrics.new}</p>
        </div>
        <div class="p-3 bg-emerald-950/30 border border-emerald-500/10 rounded-xl">
          <p class="text-[10px] uppercase font-semibold text-emerald-400 tracking-wider">Won</p>
          <p class="text-xl font-semibold text-emerald-400 mt-0.5">{metrics.won}</p>
        </div>
      </section>

      <div class="space-y-2 mb-4">
        <div class="relative">
          <Search class="w-4 h-4 text-neutral-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input 
            type="text" 
            placeholder="Search company, industry, or state..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            class="w-full h-11 pl-10 pr-4 rounded-xl bg-neutral-900 border border-white/5 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-blue-500 transition-colors"
          />
        </div>
        
        <div class="flex gap-2">
          <select 
            value={statusFilter} 
            onChange={(e) => setStatusFilter(e.target.value)}
            class="flex-1 h-9 px-2 bg-neutral-900 border border-white/5 rounded-lg text-[11px] text-neutral-300 focus:outline-none"
          >
            <option value="All">All Statuses</option>
            <option value="New">New</option>
            <option value="Contacted">Contacted</option>
            <option value="Qualified">Qualified</option>
            <option value="Won">Won</option>
          </select>

          <select 
            value={priorityFilter} 
            onChange={(e) => setPriorityFilter(e.target.value)}
            class="flex-1 h-9 px-2 bg-neutral-900 border border-white/5 rounded-lg text-[11px] text-neutral-300 focus:outline-none"
          >
            <option value="All">All Priorities</option>
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
            <option value="Critical">Critical</option>
          </select>
        </div>
      </div>

      <main class="space-y-2">
        {filteredLeads.map((lead) => (
          <div 
            key={lead.id}
            onClick={() => setSelectedLead(lead)}
            class="w-full p-4 bg-neutral-900 border border-white/5 active:border-neutral-800 rounded-xl transition-all flex items-center justify-between text-left active:bg-neutral-900/60"
          >
            <div class="space-y-1 max-w-[80%]">
              <div class="flex items-center gap-2">
                <h3 class="text-sm font-semibold text-white truncate">{lead.company_name}</h3>
                <span class={`text-[9px] px-1.5 py-0.5 rounded-md font-medium tracking-wide ${
                  lead.priority === 'Critical' ? 'bg-red-500/10 text-red-400 border border-red-500/20' :
                  lead.priority === 'High' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' : 'bg-neutral-800 text-neutral-400'
                }`}>{lead.priority}</span>
              </div>
              <p class="text-xs text-neutral-400 truncate">{lead.industry || 'No Industry Specified'}</p>
              <div class="flex items-center gap-3 pt-1 text-[11px] text-neutral-500">
                <span class="flex items-center gap-1"><MapPin class="w-3 h-3" />{lead.state || 'N/A'}</span>
                <span class="bg-neutral-800 text-neutral-300 px-2 py-0.5 rounded text-[10px] font-medium">{lead.status}</span>
              </div>
            </div>
            <ChevronRight class="w-4 h-4 text-neutral-600 shrink-0" />
          </div>
        ))}
      </main>

      {selectedLead && (
        <div class="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex justify-end">
          <div class="w-full max-w-md bg-neutral-950 h-full overflow-y-auto flex flex-col animate-slide-in shadow-2xl border-l border-white/5">
            <div class="p-4 border-b border-white/5 flex items-center justify-between sticky top-0 bg-neutral-950 z-10">
              <div>
                <span class="text-[10px] uppercase font-semibold tracking-wider text-blue-500">Lead Dossier Context</span>
                <h2 class="text-base font-bold text-white mt-0.5">{selectedLead.company_name}</h2>
              </div>
              <button onClick={() => setSelectedLead(null)} class="w-9 h-9 flex items-center justify-center rounded-xl bg-neutral-900 border border-white/5 active:scale-95">
                <X class="w-4 h-4 text-neutral-400" />
              </button>
            </div>

            <div class="p-4 space-y-5 flex-1">
              <div class="p-3.5 bg-neutral-900 border border-white/5 rounded-xl space-y-2">
                <label class="text-[11px] font-medium text-neutral-400">Update Lead Milestone</label>
                <div class="grid grid-cols-2 gap-1.5">
                  {(['New', 'Contacted', 'Qualified', 'Won', 'Lost'] as LeadStatus[]).map((st) => (
                    <button 
                      key={st}
                      onClick={() => updateStatus(selectedLead.id, st)}
                      class={`h-9 rounded-lg text-xs font-medium transition-all ${
                        selectedLead.status === st ? 'bg-blue-600 text-white font-semibold' : 'bg-neutral-950 text-neutral-400 border border-white/5'
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>

              <div class="space-y-2">
                <h4 class="text-xs font-semibold text-neutral-400 uppercase tracking-wider pl-1">Primary Touchpoints</h4>
                <div class="bg-neutral-900 border border-white/5 rounded-xl divide-y divide-white/5">
                  <a href={`tel:${selectedLead.phone}`} class="flex items-center gap-3 p-3.5 active:bg-neutral-800 transition-colors">
                    <Phone class="w-4 h-4 text-neutral-400" />
                    <div>
                      <p class="text-[10px] text-neutral-500">Phone</p>
                      <p class="text-xs text-neutral-200 font-medium mt-0.5">{selectedLead.phone || 'Not Logged'}</p>
                    </div>
                  </a>
                  <a href={`mailto:${selectedLead.email}`} class="flex items-center gap-3 p-3.5 active:bg-neutral-800 transition-colors">
                    <Mail class="w-4 h-4 text-neutral-400" />
                    <div>
                      <p class="text-[10px] text-neutral-500">Corporate Email</p>
                      <p class="text-xs text-neutral-200 font-medium mt-0.5">{selectedLead.email || 'Not Logged'}</p>
                    </div>
                  </a>
                </div>
              </div>

              <div class="space-y-2">
                <h4 class="text-xs font-semibold text-neutral-400 uppercase tracking-wider pl-1">Internal Log Notes</h4>
                <div class="p-4 bg-neutral-900 border border-white/5 rounded-xl min-h-[100px]">
                  <p class="text-xs text-neutral-300 leading-relaxed">{selectedLead.notes || 'No notes currently attached to this enterprise prospect.'}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {showAddModal && (
        <div class="fixed inset-0 bg-black/70 backdrop-blur-md z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
          <form onSubmit={handleCreateLead} class="w-full max-w-md bg-neutral-900 border-t border-white/10 rounded-t-2xl sm:rounded-2xl p-5 space-y-4 max-h-[90vh] overflow-y-auto">
            <div class="flex items-center justify-between border-b border-white/5 pb-3">
              <h3 class="text-sm font-semibold text-white">Staging New Lead Account</h3>
              <button type="button" onClick={() => setShowAddModal(false)} class="text-xs text-neutral-400">Cancel</button>
            </div>
            <div class="space-y-3">
              <div>
                <label class="text-[10px] text-neutral-400 font-medium">Company Name *</label>
                <input required type="text" onChange={e => setNewLeadForm({...newLeadForm, company_name: e.target.value})} class="w-full h-10 px-3 mt-1 bg-neutral-950 border border-white/5 rounded-lg text-xs text-white focus:outline-none focus:border-blue-500"/>
              </div>
              <div class="grid grid-cols-2 gap-2">
                <div>
                  <label class="text-[10px] text-neutral-400 font-medium">Industry</label>
                  <input type="text" onChange={e => setNewLeadForm({...newLeadForm, industry: e.target.value})} class="w-full h-10 px-3 mt-1 bg-neutral-950 border border-white/5 rounded-lg text-xs text-white focus:outline-none"/>
                </div>
                <div>
                  <label class="text-[10px] text-neutral-400 font-medium">State Code</label>
                  <input type="text" placeholder="TX" onChange={e => setNewLeadForm({...newLeadForm, state: e.target.value})} class="w-full h-10 px-3 mt-1 bg-neutral-950 border border-white/5 rounded-lg text-xs text-white focus:outline-none"/>
                </div>
              </div>
              <div class="grid grid-cols-2 gap-2">
                <div>
                  <label class="text-[10px] text-neutral-400 font-medium">Phone</label>
                  <input type="tel" onChange={e => setNewLeadForm({...newLeadForm, phone: e.target.value})} class="w-full h-10 px-3 mt-1 bg-neutral-950 border border-white/5 rounded-lg text-xs text-white focus:outline-none"/>
                </div>
                <div>
                  <label class="text-[10px] text-neutral-400 font-medium">Email</label>
                  <input type="email" onChange={e => setNewLeadForm({...newLeadForm, email: e.target.value})} class="w-full h-10 px-3 mt-1 bg-neutral-950 border border-white/5 rounded-lg text-xs text-white focus:outline-none"/>
                </div>
              </div>
              <div>
                <label class="text-[10px] text-neutral-400 font-medium">Internal Operational Notes</label>
                <textarea rows={3} onChange={e => setNewLeadForm({...newLeadForm, notes: e.target.value})} class="w-full p-3 mt-1 bg-neutral-950 border border-white/5 rounded-lg text-xs text-white focus:outline-none focus:border-blue-500 resize-none"></textarea>
              </div>
            </div>
            <button type="submit" class="w-full h-12 rounded-xl bg-blue-600 hover:bg-blue-500 text-xs font-semibold text-white tracking-wide active:scale-95 transition-all">
              Commit Lead to Base Engine
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
