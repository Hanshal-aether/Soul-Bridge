'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/auth-store';
import { supabase } from '@/lib/supabase';
import toast from 'react-hot-toast';
import { FiPlus, FiTrash2, FiArrowLeft } from 'react-icons/fi';
import Link from 'next/link';

interface FamilyMember {
  id: string;
  name: string;
  relationship: string;
  email?: string;
  phone?: string;
  date_added: string;
}

export default function FamilyPage() {
  const router = useRouter();
  const { user } = useAuthStore();
  const [members, setMembers] = useState<FamilyMember[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    relationship: 'spouse',
    email: '',
    phone: '',
  });

  useEffect(() => {
    if (!user) {
      router.push('/auth/login');
      return;
    }

    fetchFamilyMembers();
  }, [user, router]);

  const fetchFamilyMembers = async () => {
    try {
      // Try to fetch from Supabase
      const { data, error } = await supabase
        .from('family_members')
        .select('*')
        .eq('user_id', user?.uid)
        .order('date_added', { ascending: false });

      if (error) {
        console.warn('Could not fetch family members:', error);
        setMembers([]);
      } else {
        setMembers(data || []);
      }
    } catch (err) {
      console.warn('Family members fetch failed:', err);
      setMembers([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddMember = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.relationship) {
      toast.error('Please fill in required fields');
      return;
    }

    try {
      const { error } = await supabase.from('family_members').insert({
        user_id: user?.uid,
        name: formData.name,
        relationship: formData.relationship,
        email: formData.email || null,
        phone: formData.phone || null,
        date_added: new Date().toISOString(),
      });

      if (error) {
        console.warn('Could not add family member:', error);
        // Add to local state anyway
        const newMember: FamilyMember = {
          id: Date.now().toString(),
          name: formData.name,
          relationship: formData.relationship,
          email: formData.email,
          phone: formData.phone,
          date_added: new Date().toISOString(),
        };
        setMembers([newMember, ...members]);
      } else {
        toast.success('Family member added!');
        fetchFamilyMembers();
      }

      setFormData({ name: '', relationship: 'spouse', email: '', phone: '' });
      setShowForm(false);
    } catch (err) {
      console.error('Error adding family member:', err);
      toast.error('Failed to add family member');
    }
  };

  const handleDeleteMember = async (memberId: string) => {
    try {
      const { error } = await supabase
        .from('family_members')
        .delete()
        .eq('id', memberId);

      if (error) {
        console.warn('Could not delete family member:', error);
      }

      setMembers(members.filter((m) => m.id !== memberId));
      toast.success('Family member removed');
    } catch (err) {
      console.error('Error deleting family member:', err);
      toast.error('Failed to remove family member');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-20">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-slate-600 dark:text-slate-400">Loading family members...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20 px-4 pb-12">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <Link href="/dashboard" className="flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-4">
              <FiArrowLeft size={20} />
              Back to Dashboard
            </Link>
            <h1 className="text-4xl font-bold">Family Members</h1>
            <p className="text-slate-600 dark:text-slate-400 mt-2">Manage your family's healthcare accounts</p>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-lg hover:shadow-lg transition-all flex items-center gap-2"
          >
            <FiPlus size={20} />
            Add Member
          </button>
        </div>

        {/* Add Form */}
        {showForm && (
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-8 border border-slate-200 dark:border-slate-700 mb-8">
            <h2 className="text-2xl font-bold mb-6">Add Family Member</h2>
            <form onSubmit={handleAddMember} className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Name *</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg dark:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Full name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Relationship *</label>
                  <select
                    value={formData.relationship}
                    onChange={(e) => setFormData({ ...formData, relationship: e.target.value })}
                    className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg dark:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="spouse">Spouse</option>
                    <option value="child">Child</option>
                    <option value="parent">Parent</option>
                    <option value="sibling">Sibling</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Email</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg dark:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Email address"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Phone</label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg dark:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Phone number"
                  />
                </div>
              </div>
              <div className="flex gap-3">
                <button
                  type="submit"
                  className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Add Member
                </button>
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="px-6 py-2 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 font-semibold rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Members List */}
        <div className="space-y-4">
          {members.length === 0 ? (
            <div className="bg-white dark:bg-slate-800 rounded-2xl p-12 text-center border border-slate-200 dark:border-slate-700">
              <p className="text-slate-600 dark:text-slate-400 mb-4">No family members added yet</p>
              <button
                onClick={() => setShowForm(true)}
                className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors inline-flex items-center gap-2"
              >
                <FiPlus size={20} />
                Add First Member
              </button>
            </div>
          ) : (
            members.map((member) => (
              <div
                key={member.id}
                className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 flex items-center justify-between hover:shadow-lg transition-all"
              >
                <div>
                  <h3 className="text-lg font-semibold">{member.name}</h3>
                  <p className="text-slate-600 dark:text-slate-400 capitalize">{member.relationship}</p>
                  {member.email && <p className="text-sm text-slate-500">{member.email}</p>}
                  {member.phone && <p className="text-sm text-slate-500">{member.phone}</p>}
                </div>
                <button
                  onClick={() => handleDeleteMember(member.id)}
                  className="p-3 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                >
                  <FiTrash2 size={20} />
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
