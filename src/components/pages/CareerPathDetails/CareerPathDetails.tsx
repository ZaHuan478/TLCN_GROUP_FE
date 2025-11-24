import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { CareerTest, TestQuestion } from '../../../types/types';
import { getCareerTestById } from '../../../api/careerPathApi';
import { createLesson } from '../../../api/lessonApi';
import { createTest } from '../../../api/testApi';
import { Button } from '../../atoms/Button/Button';
import { Input } from '../../atoms/Input/Input';
import { Toast } from '../../molecules/ToastNotification';
import MainTemplate from '../../templates/MainTemplate/MainTemplate';

const CareerPathDetailsPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [test, setTest] = useState<CareerTest | null>(null);
    const [questions, setQuestions] = useState<TestQuestion[]>([]);
    const [loading, setLoading] = useState(false);
    const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'warning' } | null>(null);

    // Modal states for adding sub-items
    const [showAddLessonModal, setShowAddLessonModal] = useState(false);
    const [showAddTestModal, setShowAddTestModal] = useState(false);
    const [isAddingLessonTest, setIsAddingLessonTest] = useState(false);

    // Form states
    const [lessonForm, setLessonForm] = useState({ title: '', order: 1 });
    const [testForm, setTestForm] = useState({ title: '', description: '', order: 1 });
    const [currentLessonId, setCurrentLessonId] = useState<string | null>(null);

    useEffect(() => {
        if (id) {
            loadTestDetails(id);
        }
    }, [id]);

    const loadTestDetails = async (testId: string) => {
        try {
            setLoading(true);
            const data = await getCareerTestById(testId);
            setTest(data);
            if ('questions' in data) {
                setQuestions((data as any).questions);
            }
        } catch (error) {
            console.error('Failed to load test details:', error);
            setToast({ message: 'Không thể tải thông tin chi tiết.', type: 'error' });
        } finally {
            setLoading(false);
        }
    };

    const handleAddLesson = async () => {
        if (!id) return;
        try {
            const response = await createLesson(id, {
                title: lessonForm.title,
                order: lessonForm.order
            });

            setToast({ message: 'Thêm bài học thành công!', type: 'success' });
            setShowAddLessonModal(false);

            if (confirm('Bạn có muốn thêm bài kiểm tra cho bài học này ngay bây giờ không?')) {
                setCurrentLessonId((response as any).data?.id || (response as any).id);
                setIsAddingLessonTest(true);
                setShowAddTestModal(true);
            }

            setLessonForm({ title: '', order: lessonForm.order + 1 });
        } catch (error) {
            console.error('Failed to add lesson:', error);
            setToast({ message: 'Thêm bài học thất bại.', type: 'error' });
        }
    };

    const handleAddTest = async () => {
        try {
            if (isAddingLessonTest && currentLessonId) {
                await createTest({
                    lessonId: currentLessonId,
                    title: testForm.title,
                    order: testForm.order,
                    description: testForm.description
                });
                setToast({ message: 'Thêm bài kiểm tra cho bài học thành công!', type: 'success' });
            } else {
                if (id) {
                    await createTest({
                        careerPathId: id,
                        title: testForm.title,
                        order: testForm.order,
                        description: testForm.description
                    });
                    setToast({ message: 'Thêm bài kiểm tra chung thành công!', type: 'success' });
                }
            }
            setShowAddTestModal(false);
            setIsAddingLessonTest(false);
            setCurrentLessonId(null);
            setTestForm({ title: '', description: '', order: 1 });
        } catch (error) {
            console.error('Failed to add test:', error);
            setToast({ message: 'Thêm bài kiểm tra thất bại.', type: 'error' });
        }
    };

    return (
        <MainTemplate>
            <div className="min-h-screen bg-gray-50 pb-12">
                {toast && (
                    <Toast
                        message={toast.message}
                        type={toast.type}
                        onClose={() => setToast(null)}
                    />
                )}

                {/* Back Button */}
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <button
                        onClick={() => navigate('/career-paths')}
                        className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
                            <line x1="19" y1="12" x2="5" y2="12"></line>
                            <polyline points="12 19 5 12 12 5"></polyline>
                        </svg>
                        Quay lại danh sách
                    </button>
                </div>

                {loading ? (
                    <div className="flex items-center justify-center py-20">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                    </div>
                ) : test ? (
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                            {/* Header with Image */}
                            <div className="relative h-64 bg-gray-100">
                                {test.imageUrl ? (
                                    <img
                                        src={test.imageUrl}
                                        alt={test.title}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="opacity-50">
                                            <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
                                            <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
                                        </svg>
                                    </div>
                                )}
                                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-8 flex justify-between items-end">
                                    <h1 className="text-4xl font-bold text-white">{test.title}</h1>
                                </div>
                            </div>

                            {/* Action Buttons Bar */}
                            <div className="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200 px-8 py-5 flex items-center gap-3 sticky top-0 z-10 shadow-sm">
                                <Button
                                    variant="primary"
                                    onClick={() => setShowAddLessonModal(true)}
                                    className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white font-medium rounded-lg shadow-md hover:shadow-lg transition-all duration-200 transform hover:scale-105"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M12 20h9"></path>
                                        <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>
                                    </svg>
                                    Add Lesson
                                </Button>
                                <Button
                                    variant="primary"
                                    onClick={() => {
                                        setIsAddingLessonTest(false);
                                        setShowAddTestModal(true);
                                    }}
                                    className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white font-medium rounded-lg shadow-md hover:shadow-lg transition-all duration-200 transform hover:scale-105"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                                        <polyline points="14 2 14 8 20 8"></polyline>
                                        <line x1="12" y1="18" x2="12" y2="12"></line>
                                        <line x1="9" y1="15" x2="15" y2="15"></line>
                                    </svg>
                                    Add Test
                                </Button>
                            </div>

                            {/* Content */}
                            <div className="p-8 space-y-8">
                                {/* Description */}
                                <div>
                                    <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-500">
                                            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                                            <line x1="16" y1="13" x2="8" y2="13"></line>
                                            <line x1="16" y1="17" x2="8" y2="17"></line>
                                            <polyline points="10 9 9 9 8 9"></polyline>
                                        </svg>
                                        Mô tả
                                    </h3>
                                    <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                                        <p className="text-gray-600 leading-relaxed whitespace-pre-wrap text-lg">
                                            {test.description || 'Chưa có mô tả chi tiết.'}
                                        </p>
                                    </div>
                                </div>

                                {/* Questions Placeholder / List */}
                                <div>
                                    <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-500">
                                            <circle cx="12" cy="12" r="10"></circle>
                                            <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
                                            <line x1="12" y1="17" x2="12.01" y2="17"></line>
                                        </svg>
                                        Danh sách câu hỏi ({questions.length})
                                    </h3>

                                    {questions.length > 0 ? (
                                        <div className="space-y-4">
                                            {questions.map((q, index) => (
                                                <div key={q.id || index} className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                                                    <div className="font-medium text-gray-900 mb-3 text-lg">
                                                        Câu {index + 1}: {q.question}
                                                    </div>
                                                    <div className="pl-4 space-y-2">
                                                        {q.options.map((opt, i) => (
                                                            <div key={i} className="text-gray-600 flex items-center gap-3">
                                                                <span className="w-6 h-6 rounded-full border border-gray-300 flex items-center justify-center text-xs font-medium bg-gray-50">{String.fromCharCode(65 + i)}</span>
                                                                {opt}
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="bg-gray-50 rounded-xl p-12 text-center border-2 border-dashed border-gray-300">
                                            <p className="text-gray-500 text-lg">Chưa có câu hỏi nào được thêm vào bài test này.</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="text-center py-20">
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">Không tìm thấy thông tin</h2>
                        <p className="text-gray-500">Bài test không tồn tại hoặc đã bị xóa.</p>
                        <Button variant="primary" onClick={() => navigate('/career-paths')} className="mt-6">
                            Quay lại danh sách
                        </Button>
                    </div>
                )}

                {/* Add Lesson Modal */}
                {showAddLessonModal && (
                    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
                        <div className="bg-white rounded-xl p-8 w-full max-w-md shadow-2xl transform transition-all">
                            <h3 className="text-2xl font-bold mb-6 text-gray-900">Thêm bài học mới</h3>
                            <div className="space-y-5">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Tiêu đề bài học</label>
                                    <Input
                                        value={lessonForm.title}
                                        onChange={(e) => setLessonForm({ ...lessonForm, title: e.target.value })}
                                        placeholder="Nhập tiêu đề bài học"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Thứ tự (Order)</label>
                                    <Input
                                        type="number"
                                        value={lessonForm.order}
                                        onChange={(e) => setLessonForm({ ...lessonForm, order: parseInt(e.target.value) })}
                                        placeholder="Nhập thứ tự"
                                    />
                                </div>
                                <div className="flex justify-end gap-3 mt-8">
                                    <Button variant="secondary" onClick={() => setShowAddLessonModal(false)}>Hủy</Button>
                                    <Button variant="primary" onClick={handleAddLesson}>Thêm bài học</Button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Add Test Modal */}
                {showAddTestModal && (
                    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
                        <div className="bg-white rounded-xl p-8 w-full max-w-md shadow-2xl transform transition-all">
                            <h3 className="text-2xl font-bold mb-6 text-gray-900">
                                {isAddingLessonTest ? 'Thêm bài kiểm tra cho bài học' : 'Thêm bài kiểm tra'}
                            </h3>
                            <div className="space-y-5">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Tiêu đề bài kiểm tra</label>
                                    <Input
                                        value={testForm.title}
                                        onChange={(e) => setTestForm({ ...testForm, title: e.target.value })}
                                        placeholder="Nhập tiêu đề bài kiểm tra"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Mô tả</label>
                                    <Input
                                        value={testForm.description}
                                        onChange={(e) => setTestForm({ ...testForm, description: e.target.value })}
                                        placeholder="Nhập mô tả"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Thứ tự (Order)</label>
                                    <Input
                                        type="number"
                                        value={testForm.order}
                                        onChange={(e) => setTestForm({ ...testForm, order: parseInt(e.target.value) })}
                                        placeholder="Nhập thứ tự"
                                    />
                                </div>
                                <div className="flex justify-end gap-3 mt-8">
                                    <Button variant="secondary" onClick={() => setShowAddTestModal(false)}>Hủy</Button>
                                    <Button variant="primary" onClick={handleAddTest}>Thêm bài kiểm tra</Button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </MainTemplate>
    );
};

export default CareerPathDetailsPage;
