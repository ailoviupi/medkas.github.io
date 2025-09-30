const { createApp, ref, computed } = Vue;

createApp({
    setup() {
        // 新笔记数据
        const newNote = ref({
            title: '',
            content: '',
            createdAt: null
        });
        
        // 所有笔记
        const notes = ref([]);
        
        // 搜索关键词
        const searchQuery = ref('');
        
        // 当前编辑的笔记索引
        const editingIndex = ref(-1);
        
        // 从本地存储加载笔记
        const loadNotes = () => {
            const savedNotes = localStorage.getItem('vue-notes');
            if (savedNotes) {
                notes.value = JSON.parse(savedNotes);
            }
        };
        
        // 保存笔记到本地存储
        const saveNotes = () => {
            localStorage.setItem('vue-notes', JSON.stringify(notes.value));
        };
        
        // 添加新笔记
        const addNote = () => {
            if (editingIndex.value === -1) {
                // 添加新笔记
                notes.value.unshift({
                    title: newNote.value.title,
                    content: newNote.value.content,
                    createdAt: new Date().getTime()
                });
            } else {
                // 更新现有笔记
                notes.value[editingIndex.value] = {
                    title: newNote.value.title,
                    content: newNote.value.content,
                    createdAt: notes.value[editingIndex.value].createdAt
                };
                editingIndex.value = -1;
            }
            
            // 清空输入框
            newNote.value = {
                title: '',
                content: '',
                createdAt: null
            };
            
            saveNotes();
        };
        
        // 删除笔记
        const deleteNote = (index) => {
            if (confirm('确定要删除这条笔记吗？')) {
                notes.value.splice(index, 1);
                saveNotes();
            }
        };
        
        // 编辑笔记
        const editNote = (index) => {
            newNote.value = {
                title: notes.value[index].title,
                content: notes.value[index].content,
                createdAt: notes.value[index].createdAt
            };
            editingIndex.value = index;
        };
        
        // 格式化日期
        const formatDate = (timestamp) => {
            const date = new Date(timestamp);
            return `${date.getFullYear()}-${padZero(date.getMonth() + 1)}-${padZero(date.getDate())} ${padZero(date.getHours())}:${padZero(date.getMinutes())}`;
        };
        
        // 补零函数
        const padZero = (num) => {
            return num < 10 ? `0${num}` : num;
        };
        
        // 过滤笔记
        const filteredNotes = computed(() => {
            if (!searchQuery.value) {
                return notes.value;
            }
            const query = searchQuery.value.toLowerCase();
            return notes.value.filter(note => 
                note.title.toLowerCase().includes(query) || 
                note.content.toLowerCase().includes(query)
            );
        });
        
        // 初始化加载笔记
        loadNotes();
        
        return {
            newNote,
            notes,
            searchQuery,
            filteredNotes,
            addNote,
            deleteNote,
            editNote,
            formatDate
        };
    }
}).mount('#app');