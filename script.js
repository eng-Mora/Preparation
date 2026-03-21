document.addEventListener('DOMContentLoaded', function () {
    const loginContainer = document.getElementById('loginContainer');
    const mainContent = document.getElementById('main');
    const videoContainer = document.getElementById('videos');
    const homeLink = document.getElementById('homeLink');

    // Sidebar functionality
    const sidebarToggle = document.getElementById('sidebarToggle');
    const sidebar = document.getElementById('sidebar');
    const sidebarLoginToggle = document.getElementById('sidebarLoginToggle');

    // Toggle sidebar from main toggle
    sidebarToggle.addEventListener('click', function () {
        sidebar.classList.toggle('active');
    });

    // Toggle sidebar from login page toggle
    if (sidebarLoginToggle) {
        sidebarLoginToggle.addEventListener('click', function () {
            sidebar.classList.toggle('active');
        });
    }

    // Close sidebar when clicking outside
    document.addEventListener('click', function (event) {
        if (!sidebar.contains(event.target) &&
            event.target !== sidebarToggle &&
            event.target !== sidebarLoginToggle) {
            sidebar.classList.remove('active');
        }
    });

    // Home link functionality
    homeLink.addEventListener('click', function (e) {
        e.preventDefault();
        // Clear login state and reload
        localStorage.removeItem('isLoggedIn');
        localStorage.removeItem('username');
        window.location.reload();
    });
    // كائن يحتوي على بيانات جميع الطلاب
    const studentsData = {
        '17606': { name: 'عبدالرحمن', phone: '01003497670', email: 'abdelrahmanehab202@gmail.com', language: 'لغات', image: 'https://api.dicebear.com/7.x/bottts/svg?seed=17606', welcomeMessage: '☝🏽شد حيلك يا باشا… دي آخر محطة قبل الحلم الكبير' },
        '17205': { name: 'حسين', phone: '01500756375', email: 'null@null', language: 'لغات', image: 'https://api.dicebear.com/7.x/bottts/svg?seed=17205', welcomeMessage: '☝🏽شد حيلك يا باشا… دي آخر محطة قبل الحلم الكبير' },
        '17842': { name: 'يوسف', phone: '01016758963', email: 'jooo.mostafa.200737@gmail.com', language: 'لغات', image: 'https://api.dicebear.com/7.x/bottts/svg?seed=17842', welcomeMessage: '☝🏽شد حيلك يا باشا… دي آخر محطة قبل الحلم الكبير' },
        '17843': { name: 'مايكل', phone: '01225529630', email: 'maicklegamer@gmail.com', language: 'لغات', image: 'https://api.dicebear.com/7.x/bottts/svg?seed=17843', welcomeMessage: '☝🏽شد حيلك يا باشا… دي آخر محطة قبل الحلم الكبير' },
        '17869': { name: 'رفيف', phone: '01004869348', email: 'rafifmohamed088@gmail.com', language: 'لغات', image: 'https://api.dicebear.com/7.x/bottts/svg?seed=17869', welcomeMessage: '☝🏽شد حيلك يا باشا… دي آخر محطة قبل الحلم الكبير' },
        '17224': { name: 'علياء', phone: '01120008864', email: 'lalaelamir19@gmail.com', language: 'لغات', image: 'https://api.dicebear.com/7.x/bottts/svg?seed=17224', welcomeMessage: '☝🏽شد حيلك يا باشا… دي آخر محطة قبل الحلم الكبير' },
        '17624': { name: 'عبدالله', phone: '01275892161', email: 'Beedo200682@gmail.com', language: 'لغات', image: 'https://api.dicebear.com/7.x/bottts/svg?seed=17624', welcomeMessage: '☝🏽شد حيلك يا باشا… دي آخر محطة قبل الحلم الكبير' },
        '19436': { name: 'محمد', phone: '01092909759', email: 'm6966899@gmail.com', language: 'عربي', image: 'https://api.dicebear.com/7.x/bottts/svg?seed=19436', welcomeMessage: '☝🏽شد حيلك يا باشا… دي آخر محطة قبل الحلم الكبير' },
        '19573': { name: 'محمد', phone: '01144674657', email: 'raedmohamad29@gmail.com', language: 'عربي', image: 'https://api.dicebear.com/7.x/bottts/svg?seed=19573', welcomeMessage: '☝🏽شد حيلك يا باشا… دي آخر محطة قبل الحلم الكبير' },
        '19749': { name: 'مريم', phone: '01012707948', email: 'null@12null', language: 'عربي', image: 'https://api.dicebear.com/7.x/bottts/svg?seed=19749', welcomeMessage: '☝🏽شد حيلك يا باشا… دي آخر محطة قبل الحلم الكبير' },
        'admin.mora': { name: 'مورا', phone: '01011717876', email: 'mamro8529@gmail.com', language: 'عربي', image: 'https://i.ibb.co/7KQqmM3/download.png', welcomeMessage: '☝🏽 mora.admin' },
        '19753': { name: 'جنة', phone: '01065617909', email: 'gannahatem27@gmail.com', language: 'لغات', image: 'https://api.dicebear.com/7.x/bottts/svg?seed=19753', welcomeMessage: '☝🏽شد حيلك يا باشا… دي آخر محطة قبل الحلم الكبير' },
        '17286': { name: 'عمر', phone: '01009876549', email: 'ot054876@gmail.com', language: 'لغات', image: 'https://api.dicebear.com/7.x/bottts/svg?seed=17286', welcomeMessage: '☝🏽شد حيلك يا باشا… دي آخر محطة قبل الحلم الكبير' },
        '17495': { name: 'ادهم', phone: '01025054316', email: 'null@gmail.com', language: 'لغات', image: 'https://api.dicebear.com/7.x/bottts/svg?seed=17465', welcomeMessage: '☝🏽شد حيلك يا باشا… دي آخر محطة قبل الحلم الكبير' },
        '17639': { name: 'علي', phone: '01021665796', email: ' aliamr0987609876@gmail.com', language: 'لغات', image: 'https://api.dicebear.com/7.x/bottts/svg?seed=17639', welcomeMessage: '☝🏽شد حيلك يا باشا… دي آخر محطة قبل الحلم الكبير' },
        '17486': { name: 'باسم', phone: '01094822640', email: ' nill@null', language: 'لغات', image: 'https://api.dicebear.com/7.x/bottts/svg?seed=17486', welcomeMessage: '☝🏽شد حيلك يا باشا… دي آخر محطة قبل الحلم الكبير' },
        '19824': { name: 'شهد', phone: '01027283343', email: ' null@gmail.com', language: 'عربي', image: 'https://api.dicebear.com/7.x/bottts/svg?seed=19824', welcomeMessage: '☝🏽شد حيلك يا باشا… دي آخر محطة قبل الحلم الكبير' },
        '19722': { name: 'شروق', phone: '01001664659', email: ' Shroukhany442@gmail.com', language: 'عربي', image: 'https://api.dicebear.com/7.x/bottts/svg?seed=19722', welcomeMessage: '☝🏽شد حيلك يا باشا… دي آخر محطة قبل الحلم الكبير' },
        '19158': { name: 'محمد', phone: '01066168086', email: 'mohamedkhaled.h08@gmail.com', language: 'عربي', image: 'https://api.dicebear.com/7.x/bottts/svg?seed=19158', welcomeMessage: '☝🏽شد حيلك يا باشا… دي آخر محطة قبل الحلم الكبير' },
        '17893': { name: 'زاهر', phone: '01026459590', email: 'zaheressam100@gmail.com', language: 'لغات', image: 'https://api.dicebear.com/7.x/bottts/svg?seed=17893', welcomeMessage: '☝🏽شد حيلك يا باشا… دي آخر محطة قبل الحلم الكبير' },
        '19735': { name: 'هنا', phone: '01202617545', email: 'hagerkaled210@gmail.com', language: 'عربي', image: 'https://api.dicebear.com/7.x/bottts/svg?seed=19735', welcomeMessage: '☝🏽شد حيلك يا باشا… دي آخر محطة قبل الحلم الكبير' },
        '17538': { name: 'انس', phone: '01110163581', email: 'anassramyraby@gmail.com', language: 'لغات', image: 'https://api.dicebear.com/7.x/bottts/svg?seed=17538', welcomeMessage: '☝🏽شد حيلك يا باشا… دي آخر محطة قبل الحلم الكبير' },
        '19530': { name: 'حنين', phone: '', email: '', language: 'عربي', image: 'https://api.dicebear.com/7.x/bottts/svg?seed=17538', welcomeMessage: '☝🏽شد حيلك يا باشا… دي آخر محطة قبل الحلم الكبير' },
        '17026': { name: 'عمار', phone: '01154195880', email: 'ammargalal762@gmail.com', language: 'لغات', image: 'https://api.dicebear.com/7.x/bottts/svg?seed=17026', welcomeMessage: '☝🏽شد حيلك يا باشا… دي آخر محطة قبل الحلم الكبير' },
        '17038': { name: 'دنيا', phone: '01061356840', email: 'Kmfhdonia@gmail.com', language: 'لغات', image: 'https://api.dicebear.com/7.x/bottts/svg?seed=17038', welcomeMessage: '☝🏽شد حيلك يا باشا… دي آخر محطة قبل الحلم الكبير' },
        '17053': { name: 'تاح', phone: '01095923984', email: 'tageldin238@gmail.com', language: 'لغات', image: 'https://api.dicebear.com/7.x/bottts/svg?seed=17053', welcomeMessage: '☝🏽شد حيلك يا باشا… دي آخر محطة قبل الحلم الكبير' },
        '17074': { name: 'رحمة', phone: '01553635386', email: '1null@2null', language: 'لغات', image: 'https://api.dicebear.com/7.x/bottts/svg?seed=17074', welcomeMessage: '☝🏽شد حيلك يا باشا… دي آخر محطة قبل الحلم الكبير' },
        '17095': { name: 'عمر', phone: '01012211976', email: '37omar2008@gmail.com', language: 'لغات', image: 'https://api.dicebear.com/7.x/bottts/svg?seed=17095', welcomeMessage: '☝🏽شد حيلك يا باشا… دي آخر محطة قبل الحلم الكبير' },
        '17103': { name: 'سارة', phone: '01227251728', email: 'S7498559@gmail', language: 'لغات', image: 'https://api.dicebear.com/7.x/bottts/svg?seed=17103', welcomeMessage: '☝🏽شد حيلك يا باشا… دي آخر محطة قبل الحلم الكبير' },
        '17129': { name: 'السيد', phone: '01097472527', email: '1null@2null', language: 'لغات', image: 'https://api.dicebear.com/7.x/bottts/svg?seed=17129', welcomeMessage: '☝🏽شد حيلك يا باشا… دي آخر محطة قبل الحلم الكبير' },
        '17167': { name: 'ريماس', phone: '01156780292', email: 'rimashamdy6@gmail.com', language: 'لغات', image: 'https://api.dicebear.com/7.x/bottts/svg?seed=17167', welcomeMessage: '☝🏽شد حيلك يا باشا… دي آخر محطة قبل الحلم الكبير' },
        '17188': { name: 'إيمان', phone: '01063763270', email: 'noonimoon279@gmail.com', language: 'لغات', image: 'https://api.dicebear.com/7.x/bottts/svg?seed=17188', welcomeMessage: '☝🏽شد حيلك يا باشا… دي آخر محطة قبل الحلم الكبير' },
        '17218': { name: 'رنا', phone: '01060025332', email: '1null@2null', language: 'لغات', image: 'https://api.dicebear.com/7.x/bottts/svg?seed=17218', welcomeMessage: '☝🏽شد حيلك يا باشا… دي آخر محطة قبل الحلم الكبير' },
        '17243': { name: 'احمد', phone: '01030043646', email: 'medo01030043646@gmail.com', language: 'لغات', image: 'https://api.dicebear.com/7.x/bottts/svg?seed=17243', welcomeMessage: '☝🏽شد حيلك يا باشا… دي آخر محطة قبل الحلم الكبير' },
        '17247': { name: 'سيد', phone: '01009267137', email: 'sydamasm123@gmail.com', language: 'لغات', image: 'https://api.dicebear.com/7.x/bottts/svg?seed=17247', welcomeMessage: '☝🏽شد حيلك يا باشا… دي آخر محطة قبل الحلم الكبير' },
        '17262': { name: 'احمد', phone: '01062119962', email: 'daliaghonim18@gmail.com', language: 'لغات', image: 'https://api.dicebear.com/7.x/bottts/svg?seed=17262', welcomeMessage: '☝🏽شد حيلك يا باشا… دي آخر محطة قبل الحلم الكبير' },
        '17291': { name: 'حبيبه', phone: '01069629091', email: 'hmamdouh698@gmail.com', language: 'لغات', image: 'https://api.dicebear.com/7.x/bottts/svg?seed=17291', welcomeMessage: '☝🏽شد حيلك يا باشا… دي آخر محطة قبل الحلم الكبير' },
        '17355': { name: 'احمد', phone: '01094571846', email: '1null@2null', language: 'لغات', image: 'https://api.dicebear.com/7.x/bottts/svg?seed=17355', welcomeMessage: '☝🏽شد حيلك يا باشا… دي آخر محطة قبل الحلم الكبير' },
        '17358': { name: 'مازن', phone: '01091981817', email: 'null@12null', language: 'لغات', image: 'https://api.dicebear.com/7.x/bottts/svg?seed=17358', welcomeMessage: '☝🏽شد حيلك يا باشا… دي آخر محطة قبل الحلم الكبير' },
        '17381': { name: 'ملك', phone: '01005602853', email: 'malak.m352021', language: 'لغات', image: 'https://api.dicebear.com/7.x/bottts/svg?seed=17381', welcomeMessage: '☝🏽شد حيلك يا باشا… دي آخر محطة قبل الحلم الكبير' },
        '17402': { name: 'محمد', phone: '01017402575', email: '1null@2null', language: 'لغات', image: 'https://api.dicebear.com/7.x/bottts/svg?seed=17402', welcomeMessage: '☝🏽شد حيلك يا باشا… دي آخر محطة قبل الحلم الكبير' },
        '17436': { name: 'كريم', phone: '01146561478', email: 'kareem3527@gmail.com', language: 'لغات', image: 'https://api.dicebear.com/7.x/bottts/svg?seed=17436', welcomeMessage: '☝🏽شد حيلك يا باشا… دي آخر محطة قبل الحلم الكبير' },
        '17459': { name: 'يوسف', phone: '01064642935', email: 'youssefadel5807@gmail.com', language: 'لغات', image: 'https://api.dicebear.com/7.x/bottts/svg?seed=17459', welcomeMessage: '☝🏽شد حيلك يا باشا… دي آخر محطة قبل الحلم الكبير' },
        '17752': { name: 'عمر', phone: '01222256138', email: '3marmaamoun2008@gmail.com', language: 'لغات', image: 'https://api.dicebear.com/7.x/bottts/svg?seed=17752', welcomeMessage: '☝🏽شد حيلك يا باشا… دي آخر محطة قبل الحلم الكبير' },
        '17805': { name: 'اسامه', phone: '01201239301', email: 'osgamerbgghjg@gmail.com', language: 'لغات', image: 'https://api.dicebear.com/7.x/bottts/svg?seed=17805', welcomeMessage: '☝🏽شد حيلك يا باشا… دي آخر محطة قبل الحلم الكبير' },
        '17882': { name: 'احمد', phone: '01559448899', email: 'abosalah12123434@gamil.com', language: 'لغات', image: 'https://api.dicebear.com/7.x/bottts/svg?seed=17882', welcomeMessage: '☝🏽شد حيلك يا باشا… دي آخر محطة قبل الحلم الكبير' },
        '19027': { name: 'حنين', phone: '01002428829', email: 'redahaneen992@gmail.com', language: 'عربي', image: 'https://api.dicebear.com/7.x/bottts/svg?seed=19027', welcomeMessage: '☝🏽شد حيلك يا باشا… دي آخر محطة قبل الحلم الكبير' },
        '19038': { name: 'عمر', phone: '01024637707', email: 'eomar6411@gmail.com', language: 'عربي', image: 'https://api.dicebear.com/7.x/bottts/svg?seed=19038', welcomeMessage: '☝🏽شد حيلك يا باشا… دي آخر محطة قبل الحلم الكبير' },
        '19045': { name: 'محمد', phone: '01096320603', email: 'mo7amed597454@gmail.com', language: 'عربي', image: 'https://api.dicebear.com/7.x/bottts/svg?seed=19045', welcomeMessage: '☝🏽شد حيلك يا باشا… دي آخر محطة قبل الحلم الكبير' },
        '19051': { name: 'شيري', phone: '01032560973', email: 'pretty2006boss@gmail.com', language: 'عربي', image: 'https://i.ibb.co/4ZyZkhpq/Whats-App-Image-2025-12-02-at-12-28-54.jpg', welcomeMessage: '☝🏽شد حيلك يا باشا… دي آخر محطة قبل الحلم الكبير' },
        '19059': { name: 'ملك', phone: '01550801716', email: 'malakhamada7534@gmail.com', language: 'عربي', image: 'https://i.ibb.co/3YdmR74h/Whats-App-Image-2025-12-17-at-01-34-12.jpg', welcomeMessage: '☝🏽شد حيلك يا باشا… دي آخر محطة قبل الحلم الكبير' },
        '19064': { name: 'زياد', phone: '01027781029', email: '1null@2null', language: 'عربي', image: 'https://api.dicebear.com/7.x/bottts/svg?seed=19064', welcomeMessage: '☝🏽شد حيلك يا باشا… دي آخر محطة قبل الحلم الكبير' },
        '19073': { name: 'بلال', phone: '01064237884', email: 'belalsayed518@gmail.com', language: 'عربي', image: 'https://api.dicebear.com/7.x/bottts/svg?seed=19073', welcomeMessage: '☝🏽شد حيلك يا باشا… دي آخر محطة قبل الحلم الكبير' },
        '19084': { name: 'محمد', phone: '01012960767', email: '1null@2null', language: 'عربي', image: 'https://api.dicebear.com/7.x/bottts/svg?seed=19084', welcomeMessage: '☝🏽شد حيلك يا باشا… دي آخر محطة قبل الحلم الكبير' },
        '19106': { name: 'نبيل', phone: '01022429889', email: '1null@2null', language: 'عربي', image: 'https://api.dicebear.com/7.x/bottts/svg?seed=19106', welcomeMessage: '☝🏽شد حيلك يا باشا… دي آخر محطة قبل الحلم الكبير' },
        '19117': { name: 'اسامة', phone: '01127551292', email: '1null@2null', language: 'عربي', image: 'https://api.dicebear.com/7.x/bottts/svg?seed=19117', welcomeMessage: '☝🏽شد حيلك يا باشا… دي آخر محطة قبل الحلم الكبير' },
        '19128': { name: 'يحيى', phone: '01117980302', email: '1null@2null', language: 'عربي', image: 'https://api.dicebear.com/7.x/bottts/svg?seed=19128', welcomeMessage: '☝🏽شد حيلك يا باشا… دي آخر محطة قبل الحلم الكبير' },
        '19139': { name: 'سماء', phone: '01016336098', email: 'samaamustafa36@gmail.com', language: 'عربي', image: 'https://api.dicebear.com/7.x/bottts/svg?seed=19139', welcomeMessage: '☝🏽شد حيلك يا باشا… دي آخر محطة قبل الحلم الكبير' },
        '19144': { name: 'سلمي', phone: '01003864363', email: 'salmamatemd@gmail.com', language: 'عربي', image: 'https://api.dicebear.com/7.x/bottts/svg?seed=19144', welcomeMessage: '☝🏽شد حيلك يا باشا… دي آخر محطة قبل الحلم الكبير' },
        '19158': { name: 'محمد', phone: '01066168086', email: 'mohamedkhaled.h08@gmail.com', language: 'عربي', image: 'https://api.dicebear.com/7.x/bottts/svg?seed=19158', welcomeMessage: '☝🏽شد حيلك يا باشا… دي آخر محطة قبل الحلم الكبير' },
        '19172': { name: 'يوسف', phone: '01063574608', email: 'yuossiffayed45@gmail.com', language: 'عربي', image: 'https://api.dicebear.com/7.x/bottts/svg?seed=19172', welcomeMessage: '☝🏽شد حيلك يا باشا… دي آخر محطة قبل الحلم الكبير' },
        '19183': { name: 'مروة', phone: '01015062339', email: 'marwaabdulbasit05@gmail.com', language: 'عربي', image: 'https://api.dicebear.com/7.x/bottts/svg?seed=19183', welcomeMessage: '☝🏽شد حيلك يا باشا… دي آخر محطة قبل الحلم الكبير' },
        '19194': { name: 'هدى', phone: '01029166699', email: '1null@2null', language: 'عربي', image: 'https://api.dicebear.com/7.x/bottts/svg?seed=19194', welcomeMessage: '☝🏽شد حيلك يا باشا… دي آخر محطة قبل الحلم الكبير' },
        '19199': { name: 'يوسف', phone: '01096181356', email: 'ywageh479@gmail.com', language: 'عربي', image: 'https://api.dicebear.com/7.x/bottts/svg?seed=19199', welcomeMessage: '☝🏽شد حيلك يا باشا… دي آخر محطة قبل الحلم الكبير' },
        '19225': { name: 'احمد', phone: '01271775474', email: 'ahmedelkinggg98@gmail.com', language: 'عربي', image: 'https://api.dicebear.com/7.x/bottts/svg?seed=19225', welcomeMessage: '☝🏽شد حيلك يا باشا… دي آخر محطة قبل الحلم الكبير' },
        '19735': { name: 'نور', phone: '01096823685', email: 'abuzeina@gmail.com', language: 'عربي', image: 'https://api.dicebear.com/7.x/bottts/svg?seed=19735', welcomeMessage: '☝🏽شد حيلك يا باشا… دي آخر محطة قبل الحلم الكبير' },
        '19773': { name: 'محمد', phone: '01096808457', email: 'mohamednabil0986@gmail.com', language: 'عربي', image: 'https://api.dicebear.com/7.x/bottts/svg?seed=19773', welcomeMessage: '☝🏽شد حيلك يا باشا… دي آخر محطة قبل الحلم الكبير' },
        '19778': { name: 'عبدالرحمن', phone: '01067289778', email: 'null@12null', language: 'عربي', image: 'https://api.dicebear.com/7.x/bottts/svg?seed=19778', welcomeMessage: '☝🏽شد حيلك يا باشا… دي آخر محطة قبل الحلم الكبير' },
        '17428': { name: 'ادهم', phone: '01019140497', email: 'null@12null', language: 'لغات', image: 'https://api.dicebear.com/7.x/bottts/svg?seed=17428', welcomeMessage: '☝🏽شد حيلك يا باشا… دي آخر محطة قبل الحلم الكبير' },
        '19135': { name: 'نور ', phone: '01096823685', email: 'n3037763@gmail.com', language: 'عربي', image: 'https://api.dicebear.com/7.x/bottts/svg?seed=19135', welcomeMessage: '☝🏽شد حيلك يا باشا… دي آخر محطة قبل الحلم الكبير' },
        '19527': { name: 'حبيبه  ', phone: '01099291106', email: '7abebamahmoud208@gmail.com', language: 'عربي', image: 'https://api.dicebear.com/7.x/bottts/svg?seed=19527', welcomeMessage: '☝🏽شد حيلك يا باشا… دي آخر محطة قبل الحلم الكبير' },
        '17438': { name: 'احمد حسين احمد', phone: '01022409230', parentPhone: '01021052630', email: 'null@12null', grade: 'الصف الثالث الثانوي', schedule: 'السبت الساعة 4 ونص', language: 'لغات', image: 'https://api.dicebear.com/7.x/bottts/svg?seed=17438', welcomeMessage: '💪 شد حيلك يا بطل، النجاح بيبدأ بخطوة صغيرة' },
        '17586': { name: 'عبدالرحمن رفيق عادل', phone: 'null', parentPhone: '+201024171843', email: 'null@12null', grade: 'الصف الثالث الثانوي', schedule: 'السبت الساعة 4 ونص', language: 'لغات', image: 'https://api.dicebear.com/7.x/bottts/svg?seed=17586', welcomeMessage: '🔥 خليك مركز، الطريق للحلم محتاج صبر ومجهود' },
        '17803': { name: 'رؤى', phone: '01069744458', email: 'roaaezzat2008@gmail.com', language: 'لغات', image: 'https://api.dicebear.com/7.x/bottts/svg?seed=17803', welcomeMessage: '☝🏽شد حيلك يا باشا… دي آخر محطة قبل الحلم الكبير' },
        '17573': { name: 'سلمي ', phone: '01550535835', email: 'learnforall19@gmail.com', language: 'لغات', image: 'https://api.dicebear.com/7.x/bottts/svg?seed=17573', welcomeMessage: '☝🏽شد حيلك يا باشا… دي آخر محطة قبل الحلم الكبير' },
        '17492': { name: 'رغد  ', phone: '01033079565', email: 'raghadebeed@gmail.com', language: 'لغات', image: 'https://api.dicebear.com/7.x/bottts/svg?seed=17492', welcomeMessage: '☝🏽شد حيلك يا باشا… دي آخر محطة قبل الحلم الكبير' },
        '17737': { name: 'روبرت   ', phone: '01065108526', email: 'robyyyww@gmail.com', language: 'لغات', image: 'https://api.dicebear.com/7.x/bottts/svg?seed=17737', welcomeMessage: '☝🏽شد حيلك يا باشا… دي آخر محطة قبل الحلم الكبير' },
        '17720': { name: 'جنة', phone: '01096064859', email: 'gannaelshorbagy00@gmail.com', language: 'لغات', image: 'https://api.dicebear.com/7.x/bottts/svg?seed=17720', welcomeMessage: '☝🏽شد حيلك يا باشا… دي آخر محطة قبل الحلم الكبير' },

        '17539': { name: 'رزان ', phone: '01012956982', email: 'rose.hosam.ali@gmail.com', language: 'لغات', image: 'https://api.dicebear.com/7.x/bottts/svg?seed=17539', welcomeMessage: '☝🏽شد حيلك يا باشا… دي آخر محطة قبل الحلم الكبير' },
        '19936': { name: 'يوسف  ', phone: '01000902470', email: 'youssefhatem518@gmail.com', language: 'عربي', image: 'https://api.dicebear.com/7.x/bottts/svg?seed=19936', welcomeMessage: '☝🏽شد حيلك يا باشا… دي آخر محطة قبل الحلم الكبير' },
        '17534': { name: 'عمر  ', phone: '01098667770', email: 'omarmed7at99@gmil.com', language: 'لغات', image: 'https://api.dicebear.com/7.x/bottts/svg?seed=17534', welcomeMessage: '☝🏽شد حيلك يا باشا… دي آخر محطة قبل الحلم الكبير' },


        '12473': { name: 'نور ', phone: '01021145357', email: 'nourmamdouh2@icloud.com', language: 'لغات', image: 'https://api.dicebear.com/7.x/bottts/svg?seed=12473', welcomeMessage: '"Second Secondary Grade"' },
        '12633': { name: 'حلا ', phone: '01061399102', email: 'halamohsen2777@gmail.com', language: 'لغات', image: 'https://api.dicebear.com/7.x/bottts/svg?seed=12633', welcomeMessage: '"Second Secondary Grade"' },
        '12736': { name: 'مارلين ', phone: '01100424245', email: ' null@12null', language: 'لغات', image: 'https://api.dicebear.com/7.x/bottts/svg?seed=12736', welcomeMessage: '"Second Secondary Grade"' },
        '12744': { name: 'مريم ', phone: '01002688361', email: '012345678yytu@gmail.com', language: 'لغات', image: 'https://api.dicebear.com/7.x/bottts/svg?seed=12744', welcomeMessage: '"Second Secondary Grade"' },
        '12761': { name: 'أحمد ', phone: '01278139050', email: 'ay7728034@gmail.com', language: 'لغات', image: 'https://api.dicebear.com/7.x/bottts/svg?seed=12761', welcomeMessage: '"Second Secondary Grade"' },
        '12853': { name: 'مريم ', phone: '01040852040', email: 'null@12null', language: 'لغات', image: 'https://api.dicebear.com/7.x/bottts/svg?seed=12853', welcomeMessage: '"Second Secondary Grade"' },
        '12937': { name: 'سهيله ', phone: '01271115797', email: 'sa4259703@gmail.com', language: 'لغات', image: 'https://api.dicebear.com/7.x/bottts/svg?seed=12937', welcomeMessage: '"Second Secondary Grade"' },
        '12492': { name: 'عبد العليم  ', phone: '01060526663', email: 'abdelaleemashraf29112008@gmail.com', language: 'لغات', image: 'https://api.dicebear.com/7.x/bottts/svg?seed=12492', welcomeMessage: '"Second Secondary Grade"' },
        '12573': { name: 'عمر ', phone: '01018349970', parentPhone: '01064475334', email: 'tameromer088@gmail.com', language: 'لغات', image: 'https://api.dicebear.com/7.x/bottts/svg?seed=12573', welcomeMessage: '"Second Secondary Grade"' },
        '12728': { name: 'يوسف ', phone: '01063898259', parentPhone: '01093300526', email: 'yousefelaswey@gmail.com', language: 'لغات', image: 'https://api.dicebear.com/7.x/bottts/svg?seed=12728', welcomeMessage: '"Second Secondary Grade"' },
        '12837': { name: 'جودي ', phone: '01090926832', parentPhone: '01024666550', email: 'judyhelmy64@gmail.com', language: 'لغات', image: 'https://api.dicebear.com/7.x/bottts/svg?seed=12837', welcomeMessage: '"Second Secondary Grade"' },
        '12892': { name: 'زياد ', phone: '01119180836', parentPhone: '01122755033', email: 'null@12null', language: 'لغات', image: 'https://api.dicebear.com/7.x/bottts/svg?seed=12892', welcomeMessage: '"Second Secondary Grade"' },
        '12642': { name: 'مريم ', phone: '01225616672', parentPhone: '01277762548', email: 'mariambassoiny2009@icloud.com', language: 'لغات', image: 'https://api.dicebear.com/7.x/bottts/svg?seed=12642', welcomeMessage: '"Second Secondary Grade"' },
        '12749': { name: 'سما  ', phone: '01146168805', email: 'samaehab204@gmail.com', language: 'لغات', image: 'https://api.dicebear.com/7.x/bottts/svg?seed=12749', welcomeMessage: '"Second Secondary Grade"' },
        '12831': { name: 'سلمي  ', phone: '01025012781', email: 'null@12null', language: 'لغات', image: 'https://api.dicebear.com/7.x/bottts/svg?seed=12831', welcomeMessage: '"Second Secondary Grade"' },
        '12469': { name: 'روفيدا  ', phone: '01155568455', email: 'mohamedrofida13@gmail.com', language: 'لغات', image: 'https://api.dicebear.com/7.x/bottts/svg?seed=12469', welcomeMessage: '"Second Secondary Grade"' },
        '12834': { name: 'مي  ', phone: '01022342002', email: 'maimahmoudabdelal732008@gmail.com', language: 'لغات', image: 'https://api.dicebear.com/7.x/bottts/svg?seed=12834', welcomeMessage: '"Second Secondary Grade"' },
        '12437': { name: 'ملك  ', phone: '01097873179', email: 'null@12null', language: 'لغات', image: 'https://api.dicebear.com/7.x/bottts/svg?seed=12437', welcomeMessage: '"Second Secondary Grade"' },
        '12784': { name: 'عمار ', phone: '01001525971', email: 'ammarmahmoud1907@gmail.com', language: 'لغات', image: 'https://api.dicebear.com/7.x/bottts/svg?seed=12784', welcomeMessage: '"Second Secondary Grade"' },
        '12792': { name: 'هايدي ', phone: '01008548507', email: 'hanyhaidy022@gmail.com', language: 'لغات', image: 'https://api.dicebear.com/7.x/bottts/svg?seed=12792', welcomeMessage: '"Second Secondary Grade"' },
        '12332': { name: 'احمد  ', phone: '01158005054', email: '99hm.ez@gmail.com', language: 'لغات', image: 'https://api.dicebear.com/7.x/bottts/svg?seed=12332', welcomeMessage: '"Second Secondary Grade"' },
        '12372': { name: 'جنى  ', phone: '01141475986', email: 'zayedjana85@gmail.com', language: 'لغات', image: 'https://api.dicebear.com/7.x/bottts/svg?seed=12372', welcomeMessage: '"Second Secondary Grade"' },

    };


    // دالة لحفظ حالة تسجيل الدخول
    function saveLoginState(username) {
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('username', username);
    }

    // دالة للتحقق من حالة تسجيل الدخول
    function checkLoginState() {
        const isLoggedIn = localStorage.getItem('isLoggedIn');
        const username = localStorage.getItem('username');

        if (isLoggedIn === 'true' && username) {
            const student = studentsData[username];
            if (student) {
                // تحديد الكود المناسب بناءً على اسم المستخدم
                const validUsernames = {
                    'CODE1': ['19038', '19051', '19059', '19064', '19128', '19139', '19144', '19158', '19199', '19225', '19773', '19778', '19573', '19749', 'admin.mora', '19722', '19158', '19735', '19527','19936'],
                    'CODE2': ['17026', '17053', '17074', '17243', '17247', '17262', '17291', '17381', '17436', '17752', '17882', '17606', '17205', '17843', '17869', '17224', '17624', '19753', '17286', '17495', '17639', '17486', '17893', '17538', '17428', '17438', '17803', '17573', '17492', '17737', '17720', '17539','17534'],
                    'CODE3': ['1514587', '1927626', '8342306', '7288910', '3105583', '5049006', '6947481', '4851793', '8756967', '4734353', '3279816', '8176543', '4195299'],
                    'CODE4': ['7842939', '6944919', '3321034', '3008859', '2670836', '8603061', '1156924', '1780078', '4870007', '4592145', '8703407', '3610782', '8044240', '3736945', '9048755', '6455858', '4462627'],
                    'CODE5': ['12633', '12744', '12853', '12937', '12492', '12573', '12728', '12837', '12892', '12642', '12749', '12831', '12469', '12834', '12437', 'admin.mora.sec2', '12792', '12784', '12332','12372'],
                    'CODE6': ['5839204', '1742059', '6607418', '2184550', '3459850', '8814207', '2333170', '8927318', '1237605', '9007485', '6601385', '7973066', '5091763', '7406982', '6158830', '8061542'],
                    'CODE7': ['5199639', '7041829', '8826088', '8823075', '6283163', '9504873', '3188423', '7662092', '5184821', '3047303', '7406994', '5068231', '6158942', '5758845', '1938640', '4862209', '4862200', '2863209']

                };
                let code = '';
                for (const [key, values] of Object.entries(validUsernames)) {
                    if (values.includes(username)) {
                        code = key;
                        break;
                    }
                }

                if (code) {
                    loadVideoContent(code, username);
                    showMainContent();
                } else {
                    showLogin();
                }
            } else {
                showLogin();
            }
        } else {
            showLogin();
        }
    }

    function showLogin() {
        loginContainer.style.display = 'flex';
        mainContent.style.display = 'none';
    }

    function showMainContent() {
        loginContainer.style.display = 'none';
        mainContent.style.display = 'block';
    }

    window.logout = function () {
        localStorage.removeItem('isLoggedIn');
        localStorage.removeItem('username');
        window.location.reload();
    };

    window.switchChapter = function (chapterNumber) {
        const allChapters = document.querySelectorAll('.chapter-content');
        allChapters.forEach(chapter => {
            chapter.classList.remove('active');
        });

        const selectedChapter = document.getElementById(`chapter-${chapterNumber}`);
        if (selectedChapter) {
            selectedChapter.classList.add('active');
        }

        const allButtons = document.querySelectorAll('.chapter-btn');
        allButtons.forEach(button => {
            button.classList.remove('active');
        });

        const activeButton = document.querySelector(`.chapter-btn[onclick="switchChapter(${chapterNumber})"]`);
        if (activeButton) {
            activeButton.classList.add('active');
        }
    };

    window.showVideo = function (videoId) {
        // الحصول على الفصل النشط الحالي
        const activeChapter = document.querySelector('.chapter-content.active');
        if (!activeChapter) return;

        // إخفاء جميع الفيديوهات في الفصل النشط
        const allVideos = activeChapter.querySelectorAll('.video-player, .video');
        allVideos.forEach(video => {
            video.style.display = 'none';
        });

        // إظهار الفيديو المحدد فقط
        const selectedVideo = document.getElementById(videoId);
        if (selectedVideo) {
            selectedVideo.style.display = 'block';
        }
    };

    function loadVideoContent(code, username) {
        const student = studentsData[username];

        let welcomeBanner = '';

        if (student) {
            welcomeBanner = `
        <div class="welcome-banner">
            <div class="welcome-text">
                    <h3>  يا 100 أهلاً يا ${student.name}</h3>
                <p>${student.welcomeMessage}</p>
            </div>
            <div class="profile-img-container">
                <img src="${student.image}" alt="صورة البروفايل">
                <div class="show-details">اظهار التفاصيل</div>
                <div class="profile-info" id="profileInfo">
                    <p><strong>الاسم:</strong> ${student.name}</p>
                    <p><strong>رقم التليفون:</strong> ${student.phone}</p>
                    <p><strong>البريد الإلكتروني:</strong> ${student.email}</p>
                    <p><strong>لغة الدراسة:</strong> ${student.language}</p>
                </div>
            </div>
        </div>
        `;
        }

        let videoHTML = welcomeBanner;

        // إضافة قائمة الفصول لـ CODE1 و CODE2 فقط
        if (code === 'CODE1' || code === 'CODE2') {
            videoHTML += `
            <div class="chapters-nav">
                <button class="chapter-btn active" onclick="switchChapter(1)">${code === 'CODE1' ? 'الفصل الأول' : 'Chapter 1'}</button>
                <button class="chapter-btn" onclick="switchChapter(2)">${code === 'CODE1' ? 'الفصل الثاني' : 'Chapter 2'}</button>
              <button class="chapter-btn" onclick="switchChapter(3)">${code === 'CODE1' ? 'الفصل الثالث' : 'Chapter 3'}</button>

            </div>
            `;
        }

        // محتوى الفصول لـ CODE1 (عربي)
        if (code === 'CODE1') {
            videoHTML += `
            <!-- الفصل الأول -->
            <div id="chapter-1" class="chapter-content active">
                <h2 class="chapter-title">الفصل الاول: التيار الكهربي و قانون اوم و قانونا كيرشوف</h2>
                
                <div class="video-menu">
                    <h3>قائمة الفيديوهات:</h3>
                    <select class="video-selector" onchange="showVideo(this.value)">
                        <option value="">اختر الفيديو...</option>
        <option value="video2">حل واجب حصة 1</option>
        <option value="video3">حل واجب حصة 2</option>
        <option value="video4">حل واجب حصة 3</option>
        ${username === 'admin.mora' || username === '19225' ? '<option value="video5">شرح حصة 4 $</option>' : ''}
        <option value="video6">حل واجب حصة 4</option>
        <option value="video7">حل واجب حصة 5</option>
                    </select>
                </div>

                <div class="video-player" id="video2">
        <h3 class="video-title">حل واجب حصة 1 </h3>
        <iframe src="https://drive.google.com/file/d/1k03hdmxGtL6Vfd9O-cxuywaVrINwdJJp/preview" allowfullscreen></iframe>
        <h3 class="video-title">الاجابات </h3>
        <iframe src="https://drive.google.com/file/d/1G3Oq-lDSpLcnaCRyLgd7x0CcamC-rjBY/preview" width="640" height="480" allow="autoplay"></iframe>
    </div>

    <div class="video-player" id="video3" style="display:none;">
        <h3 class="video-title"> حل واجب حصة 2 </h3>
        <iframe src="https://drive.google.com/file/d/1Y0s1hTTgV-8drqiN_05yVOM6NiKvb2x2/preview" allowfullscreen></iframe>
        <h3 class="video-title">باقي حل اسئلة الحصة 2 </h3>
        <iframe src="https://drive.google.com/file/d/1Awo0t3OaoAwpESJCJG56MED6dZEXrsZ7/preview" allowfullscreen></iframe>
        <h3 class="video-title">الاجابات </h3>
        <iframe src="https://drive.google.com/file/d/1HdGZJTZ4SDURmuIaEZyMLqLrzNuvpqPP/preview" width="640" height="480" allow="autoplay"></iframe>
    </div>

    <div class="video-player" id="video4" style="display:none;">
        <h3 class="video-title">part.1 </h3>
        <iframe src="https://drive.google.com/file/d/12bMN-bgiBlK9uMKfHmqa8tDE8jKgo0E_/preview" allowfullscreen></iframe>
        <h3 class="video-title">part.2 </h3>
        <iframe src="https://drive.google.com/file/d/1x9PSxhLsS4nuh7VyiwAU9O5F-vtHz9Pe/preview" allowfullscreen></iframe>
        <h3 class="video-title">الاجابات </h3>
        <iframe src="https://drive.google.com/file/d/1IQginzp4eLmf-vZStHctMx4qoR9cVwSt/preview" width="640" height="480" allow="autoplay"></iframe>
    </div>

    ${username === 'admin.mora' || username === '19225' ? `
    <div class="video-player" id="video5" style="display:none;">
        <h3 class="video-title">حل الكويز الاول خلي بالك معاك نص ساعة </h3>
        <iframe width="640px" height="480px" src="https://forms.office.com/Pages/ResponsePage.aspx?id=DQSIkWdsW0yxEjajBLZtrQAAAAAAAAAAAAMAADN7t1JUNERKVUw0VjBZNUVWSlFQUlRBSzBJU1lBQi4u&embed=true" frameborder="0" marginwidth="0" marginheight="0" style="border: none; max-width:100%; max-height:100vh" allowfullscreen webkitallowfullscreen mozallowfullscreen msallowfullscreen> </iframe>
        <h3 class="video-title">part.1 </h3>
        <iframe src="https://drive.google.com/file/d/1-VIltXMBLLQNwbVbwhTHO2ovmYSsT0wU/preview" allowfullscreen></iframe>
        <h3 class="video-title">part.2 </h3>
        <iframe src="https://drive.google.com/file/d/15Mo7htyDhT7f9Beu9TwCiIMuxGO-dNRc/preview" allowfullscreen></iframe>
    </div>
    ` : ''}

    <div class="video-player" id="video6" style="display:none;">
        <h3 class="video-title">part.1</h3>
        <iframe src="https://drive.google.com/file/d/1Sypz3MCjVIdFTSaG9-0zXTPRNwREZ2cN/preview" allowfullscreen></iframe>
        <h3 class="video-title">part.2</h3>
        <iframe src="https://drive.google.com/file/d/1Z-5eAdOYtZEz-g3u2k81Wf68AZFqCbLD/preview" allowfullscreen></iframe>
        <h3 class="video-title">part.3</h3>
        <iframe src="https://drive.google.com/file/d/1tNf7NtlcBJUkk7bF8U3asxfzWmwZGwUt/preview" allowfullscreen></iframe>
        <h3 class="video-title">الاجابات </h3>
        <iframe src="https://drive.google.com/file/d/13bAtoKJj-2I6BiLz13gAupFPk5hlYqd7/preview" width="640" height="480" allow="autoplay"></iframe>
    </div>

    <div class="video-player" id="video7" style="display:none;">
        <h3 class="video-title">حل واجب حصة 5 </h3>
        <iframe src="https://drive.google.com/file/d/122NLtPEJMa1YCiUa-Y89Ro-W8AwwF6k_/preview" allowfullscreen></iframe>
        <h3 class="video-title">الاجابات </h3>
        <iframe src="https://drive.google.com/file/d/1xzD3Ruv20pJw8zJ9ah75Ryg9EjpwPq0e/preview" width="640" height="480" allow="autoplay"></iframe>
    </div>
            </div>

            <!-- الفصل الثاني -->  
            <div id="chapter-2" class="chapter-content">
                <h2 class="chapter-title">الفصل الثاني: التأثير المغناطيسي للتيار الكهربي</h2>
                
                 <div class="video-menu">
                    <h3>قائمة الفيديوهات:</h3>
                    <select class="video-selector" onchange="showVideo(this.value)">
                        <option value="">اختر الفيديو...</option>
        <option value="video8">حل واجب حصة 6</option>
        <option value="video9">حل واجب حصة 7</option>
        <option value="video10">حل واجب حصة 8</option>
        <option value="video11">حل واجب حصة 9</option>
        <option value="video12">حل واجب حصة 10</option>
        <option value="video13">حل واجب حصة 11</option>
        <option value="video14">حل واجب حصة 12</option>
                    </select>
                </div>
                <div class="video" id="video8">
        <h3 class="video-title">حل واجب حصة 6 </h3>
                <h3 class="video-title">part.1</h3>
        <iframe src="https://drive.google.com/file/d/1oB4cYVmLvZwYT1kzkHWp4B1IgWh4Lw3Q/preview" allowfullscreen></iframe>
                <h3 class="video-title">part.2</h3>
        <iframe src="https://drive.google.com/file/d/1Cg7qYRF0weN2lGt1g4646I1a5kYvOheT/preview" allowfullscreen></iframe>
                <h3 class="video-title">part.3</h3>
        <iframe src="https://drive.google.com/file/d/1-RTnIp68sHw7U5m1TiAXviWh_1nOfgMf/preview" allowfullscreen></iframe>
                <h3 class="video-title">الاجابات </h3>
        <iframe src="https://drive.google.com/file/d/1hg11yXNrmuVlkg3yBKqj4MftUQffBQqS/preview" width="640" height="480" allow="autoplay"></iframe> 
            </div>
         <div class="video" id="video9">
         <h3 class="video-title">حل واجب حصة 7 </h3>
         <h3 class="video-title">part.1</h3>
        <iframe src="https://drive.google.com/file/d/1fdjCqGTXWbeY1i9Bdu9qsipZC6jn22jX/preview" allowfullscreen></iframe>
         <h3 class="video-title">part.2</h3>
        <iframe src="https://drive.google.com/file/d/1kQZrgRazZbjfc1Avn7252Xj_ftoIlsPi/preview" allowfullscreen></iframe>
                        <h3 class="video-title">الاجابات </h3>
<iframe src="https://drive.google.com/file/d/1AybPqTYHCz_KkaZtQrz0ggvLUiLv9zx2/preview" width="640" height="480" allow="autoplay"></iframe>
            </div>
         <div class="video" id="video10">
         <h3 class="video-title">part.1</h3>
         <iframe src="https://drive.google.com/file/d/1_HrbQ1CJDyy5cn3TGRVCEP9oqWxkAGMT/preview" allowfullscreen></iframe>
         <h3 class="video-title">part.2</h3>
        <iframe src="https://drive.google.com/file/d/1YMmcl1NqIdJBvxVacbJsmLt-sYTiAPU3/preview" allowfullscreen></iframe>
        <h3 class="video-title">part.3</h3>
        <iframe src="https://drive.google.com/file/d/1lNSmM5bKHzRqpvCD69i7YJR8a5mBszyp/preview" allowfullscreen></iframe>
                        <h3 class="video-title">الاجابات </h3>
        <iframe src="https://drive.google.com/file/d/1P0avXQpoAZxMtSIn_OmxyMAUj6RfS3Di/preview" width="640" height="480" allow="autoplay"></iframe>
        </div>
                 <div class="video" id="video11">
                 <h3 class="video-title">حل واجب حصة 9 </h3>
                    <h3 class="video-title">part.1</h3>
                          <iframe src="https://drive.google.com/file/d/1R_DTAyxvhT32iXqgzDJFHQvhTVLum9xE/preview" allowfullscreen></iframe>
                                              <h3 class="video-title">part.2</h3>
                         <iframe src="https://drive.google.com/file/d/1dQavkTyXAUAd3YSVJDm57AV_9iyn5TNh/preview" allowfullscreen></iframe>
                        <h3 class="video-title">الاجابات </h3>
                        <iframe src="https://drive.google.com/file/d/1dViunIRkzBj6muMwDSXFFa9OaleE0Rhm/preview" width="640" height="480" allow="autoplay"></iframe>
                                  </div>
              <div class="video" id="video12">
                 <h3 class="video-title">حل واجب حصة 10 </h3>
                    <h3 class="video-title">part.1</h3>
                    <iframe src="https://drive.google.com/file/d/1NdOZGwMEhd6EjhJZTd-NL0Upl413333o/preview" allowfullscreen></iframe>
                                        <h3 class="video-title">part.2</h3>
                    <iframe src="https://drive.google.com/file/d/1MWaJdpHWnkPQLSyoRB82N2TDXSrxJg8J/preview" allowfullscreen></iframe>
                                            <h3 class="video-title">الاجابات </h3>
                        <iframe src="https://drive.google.com/file/d/1m6UiJEUFayb4isIx-Gpx21kqV2frBUoe/preview" width="640" height="480" allow="autoplay"></iframe>
                                  </div>
              <div class="video" id="video13">
                 <h3 class="video-title">حل واجب حصة 11 </h3>
                    <h3 class="video-title">part.1</h3>        
              <iframe src="https://drive.google.com/file/d/1akDAjOT_IVE2FC9RsHe9KxpXpl1bMzln/preview" allowfullscreen></iframe>
                    <h3 class="video-title">part.2</h3>        
              <iframe src="https://drive.google.com/file/d/1itxxX0LU8-wpk3DO98xwfyjpN0VkgBK-/preview" allowfullscreen></iframe>
                                            <h3 class="video-title">الاجابات </h3>
                    <iframe src="https://drive.google.com/file/d/1OAwwqU4w-4sP5el529mIno_R7JyIcWvD/preview" allowfullscreen></iframe>
                                  </div>
             <div class="video" id="video14">
             <h3 class="video-title">حل واجب حصة 12 </h3>
             <h3 class="video-title">part.1</h3>        
             <iframe src="https://drive.google.com/file/d/1r91rnCm-4EZi8mRd2JOAVVyEAv_99bC7/preview" allowfullscreen></iframe>

             <h3 class="video-title">part.2</h3>        
             <iframe src="https://drive.google.com/file/d/1MKYgXDJOUhBP1clU20frZRjduEefZt98/preview" allowfullscreen></iframe>

             <h3 class="video-title">part.3</h3>        
             <iframe src="https://drive.google.com/file/d/15NnMk6KQQd-4G_JaeUt_QDfIIhNColjo/preview" allowfullscreen></iframe>

             <h3 class="video-title">الاجابات </h3>
             <iframe src="https://drive.google.com/file/d/1dAHdV5eZ6jM1VvM8J5QveD_XpTtkTTUk/preview" allowfullscreen></iframe>
             </div>
                    </div>
            <!-- الفصل الثالث -->
            <div id="chapter-3" class="chapter-content">
                <h2 class="chapter-title">الفصل الثالث: الحث الكهرومغناطيسي</h2>

                <div class="video-menu">
                    <h3>قائمة الفيديوهات:</h3>
                    <select class="video-selector" onchange="showVideo(this.value)">
                        <option value="">اختر الفيديو...</option>
        <option value="video15">حل واجب حصة 13</option>
        <option value="video16">حل واجب حصة 14</option>
        <option value="video17">حل واجب حصة 15</option>
                    </select>
                    </div>
                <div class="video" id="video15">
             <h3 class="video-title">حل واجب حصة 13 </h3>
             <h3 class="video-title">part.1</h3>  
             <iframe src="https://drive.google.com/file/d/1umAMbU-GSo6qyvqOk0JvZY5Ho_eTLE_1/preview" allowfullscreen></iframe>
             <h3 class="video-title">part.2</h3>        
             <iframe src="https://drive.google.com/file/d/1ffAWr3B3mTmtQbsprpEWM44tQ9lUBTiu/preview" allowfullscreen></iframe>
             <h3 class="video-title">part.3</h3>        
             <iframe src="https://drive.google.com/file/d/10As7xHmneiJEITnHNUyiWNr5I_d_ztqz/preview" allowfullscreen></iframe>
             <h3 class="video-title">الاجابات </h3>
             <iframe src="https://drive.google.com/file/d/1iyw44cdtPbSrld5dS329R6DBKA6hNwhS/preview" allowfullscreen></iframe>
                          </div>
            <div class="video" id="video16">
             <h3 class="video-title">حل واجب حصة 14 </h3>
             <h3 class="video-title">part.1</h3>  
             <iframe src="https://drive.google.com/file/d/1HzQXE6RtazQaxiMnIu-Kby9r10ytj5Bf/preview" allowfullscreen></iframe>
             <h3 class="video-title">part.2</h3>  
             <iframe src="https://drive.google.com/file/d/1OpANgn-pKk0Z7K1gHH1m28onWrY-02Zt/preview" allowfullscreen></iframe>
             <h3 class="video-title">part.3</h3>  
             <iframe src="https://drive.google.com/file/d/1YurR_f9Fz4OTtaJeFiEhjkIYI04HNoiA/preview" allowfullscreen></iframe>
             <h3 class="video-title">part.4</h3>  
             <iframe src="https://drive.google.com/file/d/1H2HHLa0pMPYUbu4SJ6_jRftkvmIT8jaz/preview" allowfullscreen></iframe>
             <h3 class="video-title">الاجابات </h3>
             <iframe src="https://drive.google.com/file/d/1NlPdEITv_0YnPs4cQz3SgTIexWxEb2cj/preview" allowfullscreen></iframe>
            </div>

            <div class="video" id="video17">
             <h3 class="video-title">حل واجب حصة 15 </h3>
             <h3 class="video-title">part.1</h3>  
             <iframe src="https://drive.google.com/file/d/1V8O1w0s2I-SX__CSz2vG7qDcnyw4a-_V/preview" allowfullscreen></iframe>
             <h3 class="video-title">part.2</h3>  
             <iframe src="https://drive.google.com/file/d/1rIzHS_51qoA_kNFl5Fh1cOTD0kaGnOsW/preview" allowfullscreen></iframe>
             <h3 class="video-title">الاجابات </h3>
             <iframe src="https://drive.google.com/file/d/1KOXV0vjrYS9xwVTv119SmXM5Zv1PTA_c/preview" allowfullscreen></iframe>
            </div>



            </div>
            
            <!-- باقي الفصول (4-8) -->
            <div id="chapter-4" class="chapter-content">
                <h2 class="chapter-title">الفصل الرابع: </h2>
                <p>سيتم إضافة محتوى الفصل الرابع قريباً</p>
            </div>
            
            <div id="chapter-5" class="chapter-content">
                <h2 class="chapter-title">الفصل الخامس: </h2> 
                <p>سيتم إضافة محتوى الفصل الخامس قريباً</p>
            </div>
            
            <div id="chapter-6" class="chapter-content">
                <h2 class="chapter-title">الفصل السادس: </h2>
                <p>سيتم إضافة محتوى الفصل السادس قريباً</p>
            </div>
            
            <div id="chapter-7" class="chapter-content">
                <h2 class="chapter-title">الفصل السابع: </h2>
                <p>سيتم إضافة محتوى الفصل السابع قريباً</p>
            </div>
            
            <div id="chapter-8" class="chapter-content">
                <h2 class="chapter-title">الفصل الثامن: </h2>
                <p>سيتم إضافة محتوى الفصل الثامن قريباً</p>
            </div>
            `;
        }
        // محتوى الفصول لـ CODE2 (لغات)
        else if (code === 'CODE2') {
            videoHTML += `
            <!-- الفصل الأول -->
            <div id="chapter-1" class="chapter-content active">
                <h2 class="chapter-title">Chapter 1: Electric Current, Ohm’s Law, and Kirchhoff’s Laws</h2>
                
                <div class="video-menu">
                    <h3>Video List:</h3>
                    <select class="video-selector" onchange="showVideo(this.value)">
                        <option value="">option...</option>
                <option value="video1">Homework 1</option>
                <option value="video2">Homework 2</option>
                <option value="video3">Homework 3</option>
                <option value="video4">Homework 4</option>
                <option value="video5">Homework 5</option>
                    </select>
                </div>

                <div class="video" id="video1">
                <h3 class="video-title">Homework 1</h3>
                <iframe src="https://drive.google.com/file/d/1iiNJqMrDUKkTptUQVymPbMqEyf0UowBB/preview" allowfullscreen></iframe>
                <h3 class="video-title">answers</h3>
                <iframe src="https://drive.google.com/file/d/1L5UPraDEgW_Kmh32eOaOU5uYK8UqER4V/preview" width="640" height="480" allow="autoplay"></iframe>
            </div>

            <div class="video" id="video2">
                <h3 class="video-title">Homework 2</h3>
                <iframe src="https://drive.google.com/file/d/1kv5eqpNmC_X2ByBbfoLcXn6WUnA0eYVB/preview" allowfullscreen></iframe>
                <h3 class="video-title">answers</h3>
                <iframe src="https://drive.google.com/file/d/1Qb7N0TRJ8Cj4gkZ2nK9ZhSgAp7NC6636/preview" width="640" height="480" allow="autoplay"></iframe>
            </div>

            <div class="video" id="video3">
                <h3 class="video-title">part.1</h3>
                <iframe src="https://drive.google.com/file/d/1Tf4neobTgDj7nXd9WoUXwNYMLJC-7FJE/preview" allowfullscreen></iframe>
                <h3 class="video-title">part.2</h3>
                <iframe src="https://drive.google.com/file/d/1nHPcJfPX1cuC_Quy52RqciSkQZ1UWBdx/preview" allowfullscreen></iframe>
                <h3 class="video-title">answers</h3>
                <iframe src="https://drive.google.com/file/d/13xgvtm1WuqO5FdtAp9kE7QaOPKQ5BXAA/preview" width="640" height="480" allow="autoplay"></iframe>
            </div>

            <div class="video" id="video4">
                <h3 class="video-title">part.1</h3>
                <iframe src="https://drive.google.com/file/d/1E_gyIwo2S8t_T5_4Q1XcTvekpPGlXQwg/preview" allowfullscreen></iframe>
                <h3 class="video-title">part.2</h3>
                <iframe src="https://drive.google.com/file/d/1JAJoaikg02O7DkbDu3317lMkbjEB_b9I/preview" allowfullscreen></iframe>
                <h3 class="video-title">answers</h3>
                <iframe src="https://drive.google.com/file/d/1B9mwnM9Zl_k6l_qgUsLc2A16IoaBe4yz/preview" width="640" height="480" allow="autoplay"></iframe>
            </div>

            <div class="video" id="video5">
                <h3 class="video-title">Homework 5</h3>
                <h3 class="video-title">part.1</h3>
                <iframe src="https://drive.google.com/file/d/16TMFaBOfkIB6F14NACeqYGnNmQPrFkOh/preview" allowfullscreen></iframe>
                <h3 class="video-title">part.2</h3>
                <iframe src="https://drive.google.com/file/d/1VWTzWJ8il2QNceP29XdzYdTEXDL8wYUj/preview" allowfullscreen></iframe>
                <h3 class="video-title">answers</h3>
                <iframe src="https://drive.google.com/file/d/1JjdpQ3-YY9JcR4PIFD6qFRCiE7skqFKQ/preview" width="640" height="480" allow="autoplay"></iframe>
            </div>
                        </div>

            <!-- الفصل الثاني -->
            <div id="chapter-2" class="chapter-content">
                <h2 class="chapter-title">Chapter 2: The Magnetic Effect of Electric Current</h2>
                      <div class="video-menu">
                    <h3>Video List:</h3>
                    <select class="video-selector" onchange="showVideo(this.value)">
                        <option value="">option...</option>
                <option value="video6">Homework 6</option>
                <option value="video7">Homework 7</option>
                <option value="video8">Homework 8</option>
                <option value="video9">Homework 9</option>
                <option value="video10">Homework 10</option>
                <option value="video11">Homework 11</option>
                <option value="video12">Homework 12</option>

                    </select>
                </div>
                <div class="video" id="video6">
                <h3 class="video-title">Homework 6</h3>
              <iframe src="https://drive.google.com/file/d/1V34aIAOPGhUdRksC7kgEQ8l0s8u1NLhK/preview" allowfullscreen></iframe>
                              <h3 class="video-title">answers</h3>
              <iframe src="https://drive.google.com/file/d/1bN0w4hN1q92ukBL2N0_4RluI5As7aBiW/preview" width="640" height="480" allow="autoplay"></iframe>
                          </div>
                           <div class="video" id="video7">
                <h3 class="video-title">Homework 7</h3>
                                <h3 class="video-title">part.1</h3>
                <iframe src="https://drive.google.com/file/d/14YFJTqTwknrrSuBAJKzWgI4k3d63omkK/preview" allowfullscreen></iframe>
                                <h3 class="video-title">part.2</h3>
                <iframe src="https://drive.google.com/file/d/1abKZL-6MOzBIhGAso84HrkwWTgFNPDd-/preview" allowfullscreen></iframe>
                <h3 class="video-title">part.3</h3>
                <iframe src="https://drive.google.com/file/d/16b6LqFdMhUW4JtC_JmXpzgk-_0SFt80y/preview" allowfullscreen></iframe>
                                <h3 class="video-title">answers</h3>
                                <iframe src="https://drive.google.com/file/d/1sjiK-D-vn9evR84D9cJ7CMoBaU-nzz2z/preview" width="640" height="480" allow="autoplay"></iframe>
                                             </div>
         <div class="video" id="video8">
         <h3 class="video-title">Homework 8</h3>
                                         <h3 class="video-title">part.1</h3>
         <iframe src="https://drive.google.com/file/d/165_d1qEaXzl_128dgX4f5Z8PzLNC3I0N/preview" allowfullscreen></iframe>
                                         <h3 class="video-title">part.2</h3>
         <iframe src="https://drive.google.com/file/d/1WJ-WTJ39JMBCsqpqaZpC1zM7TIVXA4Fz/preview" allowfullscreen></iframe>
                                <h3 class="video-title">answers</h3>
                                <iframe src="https://drive.google.com/file/d/1SSYWj0_0sMPXp0brrPFoIQ7NWlwdRJba/preview" width="640" height="480" allow="autoplay"></iframe>
                                                                             </div>
                 <div class="video" id="video9">
                <h3 class="video-title">Homework 9</h3>
                          <h3 class="video-title">part.1</h3>
                 <iframe src="https://drive.google.com/file/d/1dy9Ze_jxwiPP1NfFo8n2HqPQqzqMrHWj/preview" allowfullscreen></iframe>
                          <h3 class="video-title">part.2</h3>
                          <iframe src="https://drive.google.com/file/d/12gBF4QqYN6Fie-9Nc8Z4SHkODm4zU2cn/preview" allowfullscreen></iframe>
                                                          <h3 class="video-title">answers</h3>
                          <iframe src="https://drive.google.com/file/d/1OyhK-zJZ4BGafDeZzrE3AOB-qHGaitYn/preview" width="640" height="480" allow="autoplay"></iframe>
            </div>
            <div class="video" id="video10">
                <h3 class="video-title">Homework 10</h3>
                          <h3 class="video-title">part.1</h3>
                          <iframe src="https://drive.google.com/file/d/1TCtZ7qxH-mOzrFLkCrI8peKhF6SPnk9d/preview" allowfullscreen></iframe>
                          <h3 class="video-title">part.1</h3>
                         <iframe src="https://drive.google.com/file/d/1E8yhjJ-b0D2wm-0IR6v54GPxQfYHrbGQ/preview" allowfullscreen></iframe>
                                                          <h3 class="video-title">answers</h3>
                                                          <iframe src="https://drive.google.com/file/d/1nugUrE7M23qVk3y_sp4eNvAyzmLVUgjH/preview" width="640" height="480" allow="autoplay"></iframe>
                                                          </div>
             <div class="video" id="video11">
                <h3 class="video-title">Homework 11</h3>
                          <h3 class="video-title">part.1</h3>
             <iframe src="https://drive.google.com/file/d/1Rb-r7OXwGlfM8kUTwu_eoyUBIAYKF8rq/preview" allowfullscreen></iframe>
                          <h3 class="video-title">part.2</h3>
             <iframe src="https://drive.google.com/file/d/1Zrk4bfFucA3nwa77cSjYEdK-NEAPDO_W/preview" allowfullscreen></iframe>
                          <h3 class="video-title">part.3</h3>
             <iframe src="https://drive.google.com/file/d/1DqwIeC3-J1zOyLF_LzDOh9rCMQIlLmBS/preview" allowfullscreen></iframe>
                          <h3 class="video-title">answers</h3>
             <iframe src="https://drive.google.com/file/d/1ISxN0O1eIpt-WckUFLr7IOBsRykMERUk/preview" allowfullscreen></iframe>
                                                          </div>
             <div class="video" id="video12">
             <h3 class="video-title">Homework 12</h3>
                          <h3 class="video-title">part.1</h3>
             <iframe src="https://drive.google.com/file/d/1P8QDspeIW6rc5ciD5GXSNu2hErRsz55L/preview" allowfullscreen></iframe>
                          <h3 class="video-title">part.2</h3>
             <iframe src="https://drive.google.com/file/d/1q9eGKbtTZGuzqPGeLwgRZZtWGTkNEAjr/preview" allowfullscreen></iframe>
                          <h3 class="video-title">answers</h3>
             <iframe src="https://drive.google.com/file/d/1rGc_5pkLjnaDM3CCZwXR-Pzgsb0JFcZ2/preview" allowfullscreen></iframe>
                                                          </div>

                        </div>

            <!-- الفصل الثالث -->
            <div id="chapter-3" class="chapter-content">
                <h2 class="chapter-title">Chapter 3:Electromagnetic Induction </h2>

                <div class="video-menu">
                    <h3>Video List:</h3>
                    <select class="video-selector" onchange="showVideo(this.value)">
                        <option value="">option...</option>
                <option value="video13">Homework 13</option>
                <option value="video14">Homework 14</option>
                <option value="video15">Homework 15</option>
                    </select>
                </div>
                <div class="video" id="video13">
             <h3 class="video-title">Homework 13</h3>
                          <h3 class="video-title">part.1</h3>
<iframe src="https://drive.google.com/file/d/1Do8m1xQ-tEn7U4_5xAtKNjZ2VOHiw5xU/preview" allowfullscreen></iframe>
                          <h3 class="video-title">part.2</h3>
<iframe src="https://drive.google.com/file/d/1JQV3sNeHpJswUg0ebNniRR9CcwO3VTWC/preview" allowfullscreen></iframe>
                            <h3 class="video-title">part.3</h3>
<iframe src="https://drive.google.com/file/d/1FRCVhqYZlRqCLw9XLiEpaPCSlKc22Kzn/preview" allowfullscreen></iframe>
                          <h3 class="video-title">answers</h3>
             <iframe src="https://drive.google.com/file/d/1ebTxM-9y3VwunIf2Kd7TyojxUEaiKWv4/preview" allowfullscreen></iframe>
              </div>

              <div class="video" id="video14">
             <h3 class="video-title">Homework 14</h3>
                          <h3 class="video-title">part.1</h3>
                          <iframe src="https://drive.google.com/file/d/1zgNhFXQY7pO6fbNFBVh_ClAfG5P12J0O/preview" allowfullscreen></iframe>
                          <h3 class="video-title">part.2</h3>
                          <iframe src="https://drive.google.com/file/d/1EEKW1SvwYJDpFfWzfay2hCushhiXUP1v/preview" allowfullscreen></iframe>
                          <h3 class="video-title">part.3</h3>
                          <iframe src="https://drive.google.com/file/d/1NUJF2103h1BTxWlhtVUuhZsUwraul30M/preview" allowfullscreen></iframe>
                          <h3 class="video-title">answers</h3>
                          <iframe src="https://drive.google.com/file/d/1Fo2A56VlE0SuhmVKQxWoG1LJzjRRIKZA/preview" allowfullscreen></iframe>
                                      </div>


             <div class="video" id="video15">
             <h3 class="video-title">Homework 15</h3>
             <h3 class="video-title">part.1</h3>
             <iframe src="https://drive.google.com/file/d/1okTYOXI6vh2za5NDNZyOQHxshAODWqmU/preview" allowfullscreen></iframe>
             <h3 class="video-title">part.2</h3>
             <iframe src="https://drive.google.com/file/d/1PgYZv__rwa_sYhJFrT4K2JQaKS4qWRwT/preview" allowfullscreen></iframe>
             <h3 class="video-title">answers</h3>
             <iframe src="https://drive.google.com/file/d/1Zk1zi9uj3edaCsU_J7o5Yb73NZgXbksC/preview" allowfullscreen></iframe>
               </div>




            </div>
            
            <!-- باقي الفصول (4-8) -->
            <div id="chapter-4" class="chapter-content">
                <h2 class="chapter-title">Chapter 4: </h2>
                <p>Chapter 4 content will be added soon</p>
            </div>
            
            <div id="chapter-5" class="chapter-content">
                <h2 class="chapter-title">Chapter 5: </h2>
                <p>Chapter 5 content will be added soon</p>
            </div>
            
            <div id="chapter-6" class="chapter-content">
                <h2 class="chapter-title">Chapter 6: </h2>
                <p>Chapter 6 content will be added soon</p>
            </div>
            
            <div id="chapter-7" class="chapter-content">
                <h2 class="chapter-title">Chapter 7: </h2>
                <p>Chapter 7 content will be added soon</p>
            </div>
            
            <div id="chapter-8" class="chapter-content">
                <h2 class="chapter-title">Chapter 8: </h2>
                <p>Chapter 8 content will be added soon</p>
            </div>
            `;
        }
        // النظام القديم للأنواع الأخرى (CODE3, CODE4, CODE5)
        else if (code === 'CODE3') {
            videoHTML += `
            <h2> مراجعة الفصل الاول </h2>
            <select id="videoSelector" class="form-select" onchange="showVideo(this.value)">
                <option value="">option...</option>
                <option value="video1">شرح الفصل الاول</option>
                <option value="video2">حل تدريبات الدرس الاول</option>
                <option value="video3">حل تدريبات الدرس الثاني</option>
                <option value="video4">حل تدريبات الدرس الثالث</option>
                <option value="video5">حل تدريبات الدرس الرابع</option>
            </select>
            
            <div class="video" id="video1">
                <h3 class="video-title">Part.1</h3>
                <iframe src="https://drive.google.com/file/d/16UzX2Nfb4HGPDUWFTiG_p__RTfMTuXQR/preview" allowfullscreen></iframe>
                <h3 class="video-title">Part.2</h3>
                <iframe src="https://drive.google.com/file/d/1rYDFBKZPf4la00IzGtWR4f9Nu7sdqVRD/preview" allowfullscreen></iframe>
                <h3 class="video-title">Part.3</h3>
                <iframe src="https://drive.google.com/file/d/1xyBmw7CqQ1XuvjzvjT-srDO0E0xGQG6E/preview" allowfullscreen></iframe>
            </div>
            
            <div class="video" id="video2">
                <h3 class="video-title">Part.1</h3>
                <iframe src="https://drive.google.com/file/d/16t3A4UF-VpZVnrw9ddR8M-unHtgY7Vb2/preview" allowfullscreen></iframe>
                <h3 class="video-title">Part.2</h3>
                <iframe src="https://drive.google.com/file/d/12ZoKSUMdDLrRzH9TqJwWG6do7vWIxwA5/preview" allowfullscreen></iframe>
            </div>
            
            <div class="video" id="video3">
                <h3 class="video-title">حل تدريبات الدرس الثاني</h3>
                <iframe src="https://drive.google.com/file/d/13K5pRTKJurRmXFpcD18-wbZLGNSLdZor/preview" allowfullscreen></iframe>
            </div>
            
            <div class="video" id="video4">
                <h3 class="video-title">حل تدريبات الدرس الثالث</h3>
                <iframe src="https://drive.google.com/file/d/1-RNGfZ0kxFiwSlTBcC6Kl6AFD_tNegoM/preview" allowfullscreen></iframe>
            </div>
            
            <div class="video" id="video5">
                <h3 class="video-title">Part.1</h3>
                <iframe src="https://drive.google.com/file/d/1RDXJMFgrU5jgTyHr5s6KRrCQJ1rgA99r/preview" allowfullscreen></iframe>
                <h3 class="video-title">Part.2</h3>
                <iframe src="https://drive.google.com/file/d/1myy8xQ2gSvSoBreZK1DfpmzDQGqXVF-i/preview" allowfullscreen></iframe>
            </div>
        `;
        }
        // فيديوهات مراجعة الفصل الاول لغات هااا
        else if (code === 'CODE4') {
            videoHTML += `
            <h2> Revision of Chapter 1 </h2>
            <select id="videoSelector" class="form-select" onchange="showVideo(this.value)">
                <option value="">option...</option>
                <option value="video1">Explanation of Chapter 1</option>
                <option value="video2">lecture 1 exercises</option>
                <option value="video3">lecture 2 exercises</option>
                <option value="video4">lecture 3 exercises</option>
                <option value="video5">lecture 4 exercises</option>
            </select>
            
            <div class="video" id="video1">
                <h3 class="video-title">part.1 </h3>
                <iframe src="https://drive.google.com/file/d/1QQJBGgQNp-glB5wdLCOGVkFzgk2WFQbX/preview" allowfullscreen></iframe>
                <h3 class="video-title">part.2 </h3>
                <iframe src="https://drive.google.com/file/d/1QSOLviOMwU31qGRWo3MaEDddElsr6CMz/preview" allowfullscreen></iframe>
                <h3 class="video-title">part.3 </h3>
                <iframe src="https://drive.google.com/file/d/1QU1WOgR8EknGyZjKeyOA9rAl3tqGVs2L/preview" allowfullscreen></iframe>
            </div>
            
            <div class="video" id="video2">
                <h3 class="video-title">lecture 1 exercises </h3>
                <iframe src="https://drive.google.com/file/d/1MGm9pT1T2Wme-MO9iMe-b7sKpYvcj3Gw/preview" allowfullscreen></iframe>
            </div>
            
            <div class="video" id="video3">
                <h3 class="video-title">part.1 </h3>
                <iframe src="https://drive.google.com/file/d/13L0ifCf-T6YGnpCwavxXPB-RVbVHmg8P/preview" allowfullscreen></iframe>
                <h3 class="video-title">part.2 </h3>
                <iframe src="https://drive.google.com/file/d/1PSEE0hTo8j8sKnyiA7n7L5th61yxb7yj/preview" allowfullscreen></iframe>
                <h3 class="video-title">part.3 </h3>
                <iframe src="https://drive.google.com/file/d/1dKYEF4dDpvMqNJ_mCLGpPDSholq7R5Rm/preview" allowfullscreen></iframe>
            </div>
            
            <div class="video" id="video4">
                <h3 class="video-title">lecture 2 exercises </h3>
                <iframe src="https://drive.google.com/file/d/1_hfwKKYNdY6J3wgDQS9vJqbYpQ_g6n45/preview" allowfullscreen></iframe>
            </div>
            
            <div class="video" id="video5">
                <h3 class="video-title">part.1 </h3>
                <iframe src="https://drive.google.com/file/d/1hqTGYDwSqnWtFqKUfZVr4mLWXVAtMzCy/preview" allowfullscreen></iframe>
                <h3 class="video-title">part.2 </h3>
                <iframe src="https://drive.google.com/file/d/1ccLtf7KaafkEQTxzgIYIBfMn7Jhwyb3d/preview" allowfullscreen></iframe>
            </div>
        `;
        }
        // فيديوهات تانية ثانوي لغات هااا
        else if (code === 'CODE5') {
            videoHTML += `
            <h2> Homework </h2>
            <select id="videoSelector" class="form-select" onchange="showVideo(this.value)">
                <option value="">option...</option>
                <option value="video1">Homework.2</option>
                <option value="video2">Homework.3</option>
                <option value="video3">Homework.4</option>
                <option value="video4">Homework.5</option>
                <option value="video5">Homework.7</option>
                <option value="video6">Homework.8</option>
                <option value="video7">Homework.9</option>
                <option value="video8">Homework.11</option>

            </select>
            
            <div class="video" id="video1">
                <h3 class="video-title">Homework.2 </h3>
                <iframe src="https://drive.google.com/file/d/1r6PxgT71wzqj9M_IX8xDp-pyMojeT202/preview" allowfullscreen></iframe>
            </div>
            <div class="video" id="video2">
                <h3 class="video-title">Homework.3 </h3>
<iframe src="https://drive.google.com/file/d/1VEiSRzoQ209TO-pCJp6yXRDRulstM_H4/preview" allowfullscreen></iframe>
                            </div>
                            <div class="video" id="video3">
                <h3 class="video-title">Homework.4 </h3>
<iframe src="https://drive.google.com/file/d/1fDXYuXsHyiJrgn6aXZ1oKt8GUFUOd8mo/preview" allowfullscreen></iframe>
                <h3 class="video-title">Quiz 3 </h3>
<iframe src="https://drive.google.com/file/d/1uzwOJJRa2hA4o_wbTiMoSc_kouYXkT6n/preview" allowfullscreen></iframe>
                            </div>
         <div class="video" id="video4">
                <h3 class="video-title">Homework.5 </h3>
                                <h3 class="video-title">part.1 </h3>
<iframe src="https://drive.google.com/file/d/1WK21GMXEDNF1-Qo8wRckNkDfhb2mdSKD/preview" allowfullscreen></iframe>
                                <h3 class="video-title">part.2 </h3>
<iframe src="https://drive.google.com/file/d/1sjvByK6t0xGu3fTOMcoj3xAd4fhAlXKe/preview" allowfullscreen></iframe>
                            </div>
                            <div class="video" id="video5">
                <h3 class="video-title">Homework.7 </h3>
                <iframe src="https://drive.google.com/file/d/1RpoT2kK-45fCyhfK-r06VQVJcvW-o7UE/preview" allowfullscreen></iframe>
                </div>
                <div class="video" id="video6">
                <h3 class="video-title">Homework.8 </h3>
             <iframe src="https://drive.google.com/file/d/1A3n8rdVMRKgvbJR4tK3rfrBQcEOiaFup/preview" allowfullscreen></iframe>
                </div>

              <div class="video" id="video7">
                <h3 class="video-title">Homework.9 </h3>
              <iframe src="https://drive.google.com/file/d/14ddUsRiVBoWM921WLNFmSDOWhGZTp3bJ/preview" allowfullscreen></iframe>
                </div>

                 <div class="video" id="video8">
                <h3 class="video-title">Homework.11 </h3>
            <h3 class="video-title">part.1 </h3>
         <iframe src="https://drive.google.com/file/d/1r1Ej2vEjHQqho9iAIWJL5Qji-Pjkqdpv/preview" allowfullscreen></iframe>
            <h3 class="video-title">part.2 </h3>
            <iframe src="https://drive.google.com/file/d/10B-vQm7OWjW9FF0SgYhwqR6RrlvQ_7Ah/preview" allowfullscreen></iframe>

                </div>



        `;
        } else if (code === 'CODE6') {
            videoHTML += `
            <h2> مراجعة الفصل الثاني </h2>
            <select id="videoSelector" class="form-select" onchange="showVideo(this.value)">
                <option value="">option...</option>
                <option value="video1">شرح الفصل الثاني (الجزء الأول)</option>
                            <option value="video2">شرح الفصل الثاني (الجزء الثاني)</option>
                            <option value="video3">شرح الفصل الثاني (الجزء الثالث)</option>
                            <option value="video4">تدريبات الدرس الأول</option>
                            <option value="video5">تدريبات الدرس الثاني</option>
                            <option value="video6">تدريبات الدرس الثالث</option>
                            <option value="video7">تدريبات الدرس الرابع</option>
                        </select>

                        <div class="video" id="video1">
                            <h3 class="video-title">شرح الفصل الثاني (الجزء الأول)</h3>
                            <iframe src="https://drive.google.com/file/d/1JsbhZ8UWhqh9p2RlecTBrCa5L_8vgJCR/preview" allowfullscreen></iframe>
                        </div>

                        <div class="video" id="video2">
                            <h3 class="video-title">شرح الفصل الثاني (الجزء الثاني)</h3>
                            <iframe src="https://drive.google.com/file/d/1fOeP-_8VgSYQkiR5BeMhL0Xt422Wv7Vc/preview" allowfullscreen></iframe>
                        </div>

                        <div class="video" id="video3">
                            <h3 class="video-title">شرح الفصل الثاني (الجزء الثالث)</h3>
                            <iframe src="https://drive.google.com/file/d/17dQEtszqYpmPmpU3GKYfsiyjGmwCHKhq/preview" allowfullscreen></iframe>
                        </div>

                        <div class="video" id="video4">
                            <h3 class="video-title">تدريبات الدرس الأول</h3>
                            <h3 class="video-title">الجزء الأول</h3>
                            <iframe src="https://drive.google.com/file/d/1Xafno2FXrklMu3N5udbsb_FAPQwQI0Na/preview" allowfullscreen></iframe>

                            <h3 class="video-title">الجزء الثاني</h3>
                            <iframe src="https://drive.google.com/file/d/1Uqmcfk2Ujoq2X_u8-6K3MTIA7B9NQ-RY/preview" allowfullscreen></iframe>

                            <h3 class="video-title">الجزء الثالث</h3>
                            <iframe src="https://drive.google.com/file/d/1b4NmhBy8VpzKk4wl0ktq9CvVDU5RVhgJ/preview" allowfullscreen></iframe>

                            <h3 class="video-title">الجزء الرابع</h3>
                            <iframe src="https://drive.google.com/file/d/1oYsLZZQhUABeYI9aH2Ac1_eewUfYOC1D/preview" allowfullscreen></iframe>
                        </div>

                        <div class="video" id="video5">
                            <h3 class="video-title">تدريبات الدرس الثاني</h3>
                            <h3 class="video-title">الجزء الأول</h3>
                            <iframe src="https://drive.google.com/file/d/1n8VJZWh6MZLM5EJZoydah6GQzsvpx_pN/preview" allowfullscreen></iframe>

                            <h3 class="video-title">الجزء الثاني</h3>
                            <iframe src="https://drive.google.com/file/d/1XcTlpD_pOpFchYzye_OzLf54RoxlfVWl/preview" allowfullscreen></iframe>
                        </div>

                        <div class="video" id="video6">
                            <h3 class="video-title">تدريبات الدرس الثالث</h3>
                            <h3 class="video-title">الجزء الأول</h3>
                            <iframe src="https://drive.google.com/file/d/1FSiqPd1aI2N6ObTw1IqskrkkT5A3wDeV/preview" allowfullscreen></iframe>

                            <h3 class="video-title">الجزء الثاني</h3>
                            <iframe src="https://drive.google.com/file/d/18uhR-4gz7w9Npu9Ronztyu-IMukHurld/preview" allowfullscreen></iframe>

                            <h3 class="video-title">الجزء الثالث</h3>
                            <iframe src="https://drive.google.com/file/d/1B0R8m9BavCxYEtXOz1qMHiQMEHqCebAA/preview" allowfullscreen></iframe>
                        </div>

                        <div class="video" id="video7">
                            <h3 class="video-title">تدريبات الدرس الرابع</h3>
                            <h3 class="video-title">الجزء الأول</h3>
                            <iframe src="https://drive.google.com/file/d/11MiD_5E587CPRDIRi4j6nMth61_8YbiW/preview" allowfullscreen></iframe>

                            <h3 class="video-title">الجزء الثاني</h3>
                            <iframe src="https://drive.google.com/file/d/1hSEX0DJvQTrggrkmtIm0NxyoEFvd_RN4/preview" allowfullscreen></iframe>

                            <h3 class="video-title">الجزء الثالث</h3>
                            <iframe src="https://drive.google.com/file/d/17czArTr3Mms54nFtW00TIeA8PHAS-vpc/preview" allowfullscreen></iframe>
            </div>
        `;
        }
        else if (code === 'CODE7') {
            videoHTML += `
            <h2> Revision of Chapter 2 </h2>
            <select id="videoSelector" class="form-select" onchange="showVideo(this.value)">
                <option value="">option...</option>
                <option value="video1">Magnetic flux </option>
                <option value="video2">Flux density due to current passing in straight wire</option>
                <option value="video3">Total flux density</option>
                <option value="video4">Cicular coil </option>
                <option value="video5">Solenoid </option>
                <option value="video6">Magnetic force </option>
                <option value="video7">Torque </option>
                <option value="video8">Galvanometer </option>
                <option value="video9">Ammeter </option>
                <option value="video10">Voltmeter </option>
                <option value="video11">Ohmmeter </option>
                <option value="video12">Important on devices</option>
                <option value="video13">Lecture 1 exercises</option>
                <option value="video14">Lecture 2 exercises</option>
                <option value="video15">Lecture 3 exercises</option>
                <option value="video16">Lecture 4 exercises</option>


            </select>



            <div class="video" id="video1" style="display: none;">
                <h1 class="video-title">Magnetic flux</h1>
<iframe src="https://drive.google.com/file/d/15KaT0AVNz1WNIaT2sSkWzxNlFdnrKiNi/preview"
        width="640"
        height="480"
        allow="autoplay"
        allowfullscreen></iframe>
                 </div>

            <div class="video" id="video2" style="display: none;">
            <h1 class="video-title">Flux density due to current passing in straight wire</h1>
<iframe src="https://drive.google.com/file/d/1A8putuPbjHw5CeNHCl_SYby-HdvRN5xH/preview"
        width="640"
        height="480"
        allow="autoplay"
        allowfullscreen></iframe>
            </div>

              <div class="video" id="video3" style="display: none;">
            <h1 class="video-title"> Total flux density</h1>
<iframe src="https://drive.google.com/file/d/1wLttY10Q-iQ8yXjLIhb8WJPBqwiq6uKo/preview"
        width="640"
        height="480"
        allow="autoplay"
        allowfullscreen></iframe>
            </div>

              <div class="video" id="video4" style="display: none;">
            <h1 class="video-title">Cicular coil </h1>
<iframe src="https://drive.google.com/file/d/1dDMF-1y_g20K5iec815xjTQesF7ORQdk/preview"
        width="640"
        height="480"
        allow="autoplay"
        allowfullscreen></iframe>
            </div>

              <div class="video" id="video5" style="display: none;">
            <h1 class="video-title"> Solenoid</h1>
<iframe src="https://drive.google.com/file/d/1KN8YLcwh5csP5MSqC-y5cNOh8saC1kz7/preview"
        width="640"
        height="480"
        allow="autoplay"
        allowfullscreen></iframe>
            </div>

              <div class="video" id="video6" style="display: none;">
            <h1 class="video-title">Magnetic force </h1>
<iframe src="https://drive.google.com/file/d/10dHYNaaRFkvAuoW7lKZLIWWi9so-5HKR/preview"
        width="640"
        height="480"
        allow="autoplay"
        allowfullscreen></iframe>
            </div>

              <div class="video" id="video7" style="display: none;">
            <h1 class="video-title"> Torque</h1>
<iframe src="https://drive.google.com/file/d/1WcTWRaxKrMaE6-sA1hDeOVModv_zos7R/preview"
        width="640"
        height="480"
        allow="autoplay"
        allowfullscreen></iframe>
            </div>

              <div class="video" id="video8" style="display: none;">
            <h1 class="video-title"> Galvanometer</h1>
<iframe src="https://drive.google.com/file/d/1GBm6oLaP1vQSSijqk7_tiK-a_UOK2N2x/preview"
        width="640"
        height="480"
        allow="autoplay"
        allowfullscreen></iframe>
            </div>

              <div class="video" id="video9" style="display: none;">
            <h1 class="video-title">Ammeter </h1>
<iframe src="https://drive.google.com/file/d/1CGdm_XWQNu_T9LuuVqtoaJwWOvQa1B9K/preview"
        width="640"
        height="480"
        allow="autoplay"
        allowfullscreen></iframe>
            </div>

              <div class="video" id="video10" style="display: none;">
            <h1 class="video-title"> Voltmeter</h1>
<iframe src="https://drive.google.com/file/d/1M-5z44sdEw1oP2u3p4WSYEe6gaCarnmB/preview"
        width="640"
        height="480"
        allow="autoplay"
        allowfullscreen></iframe>
</div>

              <div class="video" id="video11" style="display: none;">
            <h1 class="video-title"> Ohmmeter</h1>
<iframe src="https://drive.google.com/file/d/1B2bPG2Jd3mxGfYwPxvjxVGD4TRKkTH3d/preview"
        width="640"
        height="480"
        allow="autoplay"
        allowfullscreen></iframe>
            </div>
              <div class="video" id="video12" style="display: none;">
            <h1 class="video-title"> Important on devices</h1>
<iframe src="https://drive.google.com/file/d/19uTpb0KheuAWuR3vyDylR0ge0EWY-8aW/preview"
        width="640"
        height="480"
        allow="autoplay"
        allowfullscreen></iframe>
            </div>

                          <div class="video" id="video13" style="display: none;">
            <h1 class="video-title"> Lecture 1 exercises</h1>
             <h1 class="video-title"> part 1</h1>
<iframe src="https://drive.google.com/file/d/1CSKT46MhUNa5Hd1J3dFyTfFKKncZ9cw-/preview"
        width="640"
        height="480"
        allow="autoplay"
        allowfullscreen></iframe>
                        <h1 class="video-title"> part 2</h1>
<iframe src="https://drive.google.com/file/d/1D1fuPu2GXxOf7FiYKc9CsyPtzlLIr-X6/preview"
        width="640"
        height="480"
        allow="autoplay"
        allowfullscreen></iframe>
                         <h1 class="video-title"> part 3</h1>
<iframe src="https://drive.google.com/file/d/11SJIHFp3YvNoOKvOcd_Y4ZVil5NkZj2y/preview"
        width="640"
        height="480"
        allow="autoplay"
        allowfullscreen></iframe>
                        <h1 class="video-title"> part 4</h1>
<iframe src="https://drive.google.com/file/d/1kH-Fy4ZQIVwUb-9aymh9JZOHyF9P8wTO/preview"
        width="640"
        height="480"
        allow="autoplay"
        allowfullscreen></iframe>
           </div>

                          <div class="video" id="video14" style="display: none;">
            <h1 class="video-title"> Lecture 2 exercises</h1>
<iframe src="https://drive.google.com/file/d/1oBoK9l4K7tbDUWb-xhq7qv5-_QgeweZG/preview"
        width="640"
        height="480"
        allow="autoplay"
        allowfullscreen>
</iframe>
           </div>
                          <div class="video" id="video15" style="display: none;">
            <h1 class="video-title"> Lecture 3 exercises</h1>
<iframe src="https://drive.google.com/file/d/1E4v_fKT0zmliw0KM1is4Attl3Pr4sZOo/preview"
        width="640"
        height="480"
        allow="autoplay"
        allowfullscreen>
</iframe>
                      </div>

                      <div class="video" id="video16" style="display: none;">
            <h1 class="video-title"> Lecture 4 exercises</h1>
                        <h1 class="video-title"> part 1</h1>
<iframe src="https://drive.google.com/file/d/1ezGOIbNqI314sf209HQgS1zifixZWPlP/preview"
        width="640"
        height="480"
        allow="autoplay"
        allowfullscreen>
</iframe>


                                   <h1 class="video-title"> part 2</h1>
<iframe src="https://drive.google.com/file/d/1R0ZQXkYbajlfrynBhmcxcVt7HcP_21bs/preview"
        width="640"
        height="480"
        allow="autoplay"
        allowfullscreen></iframe>
                                              <h1 class="video-title"> part 3</h1>
<iframe src="https://drive.google.com/file/d/1kBFmbFj0zV4BBXqvHbVo3Xe4S2X7TzMs/preview"
        width="640"
        height="480"
        allow="autoplay"
        allowfullscreen></iframe>

                      </div>
        `;
        }

        // إضافة زر تسجيل الخروج في جميع الحالات
        videoHTML += `
        <div class="logout-container">
            <button onclick="window.logout()" class="logout-btn">تسجيل الخروج</button>
        </div>
    `;

        videoContainer.innerHTML = videoHTML;

        // إضافة حدث النقر على صورة البروفايل أو نص "اظهار التفاصيل"
        const profileImgContainer = document.querySelector('.profile-img-container');
        if (profileImgContainer) {
            profileImgContainer.addEventListener('click', function (e) {
                e.stopPropagation();
                const profileInfo = document.getElementById('profileInfo');
                if (profileInfo) {
                    profileInfo.classList.toggle('active');
                }
            });
        }

        // إغلاق معلومات البروفايل عند النقر في أي مكان آخر
        document.addEventListener('click', function () {
            const profileInfo = document.getElementById('profileInfo');
            if (profileInfo) {
                profileInfo.classList.remove('active');
            }
        });

        // إضافة وظيفة showVideo للأنواع الأخرى
        if (code !== 'CODE1' && code !== 'CODE2') {
            const videoSelector = document.getElementById('videoSelector');
            if (videoSelector) {
                videoSelector.addEventListener('change', function () {
                    const selectedVideo = videoSelector.value;
                    // إخفاء جميع الفيديوهات أولاً
                    const videos = document.querySelectorAll('.video');
                    videos.forEach(video => video.style.display = 'none');

                    // إظهار الفيديو المحدد فقط
                    const videoToShow = document.getElementById(selectedVideo);
                    if (videoToShow) {
                        videoToShow.style.display = 'block';
                    }
                });
            }
        }
    }

    document.getElementById('loginForm').addEventListener('submit', function (event) {
        event.preventDefault();

        const username = document.getElementById('username').value.trim();
        const errorMessage = document.getElementById('errorMessage');

        const validUsernames = {
            'CODE1': ['19038', '19051', '19059', '19064', '19128', '19139', '19144', '19158', '19199', '19225', '19773', '19778', '19573', '19749', 'admin.mora', '19722', '19158', '19735', '19527', '19936'],
            'CODE2': ['17026', '17053', '17074', '17243', '17247', '17262', '17291', '17381', '17436', '17752', '17882', '17606', '17205', '17843', '17869', '17224', '17624', '19753', '17286', '17495', '17639', '17486', '17893', '17538', '17428', '17438', '17803', '17573', '17492', '17737', '17720', '17539', '17534'],
            'CODE3': ['1514587', '1927626', '8342306', '7288910', '3105583', '5049006', '6947481', '4851793', '8756967', '4734353', '3279816', '8176543', '4195299'],
            'CODE4': ['7842939', '6944919', '3321034', '3008859', '2670836', '8603061', '1156924', '1780078', '4870007', '4592145', '8703407', '3610782', '8044240', '3736945', '9048755', '6455858', '4462627'],
            'CODE5': ['12633', '12744', '12853', '12937', '12492', '12573', '12728', '12837', '12892', '12642', '12749', '12831', '12469', '12834', '12437', 'admin.mora.sec2', '12792', '12784', '12332', '12372'],
            'CODE6': ['5839204', '1742059', '6607418', '2184550', '3459850', '8814207', '2333170', '8927318', '1237605', '9007485', '6601385', '7973066', '5091763', '7406982', '6158830', '8061542'],
            'CODE7': ['5199639', '7041829', '8826088', '8823075', '6283163', '9504873', '3188423', '7662092', '5184821', '3047303', '7406994', '5068231', '6158942', '5758845', '1938640', '4862209', '4862200', '2863209']

        };

        let code = '';
        for (const [key, values] of Object.entries(validUsernames)) {
            if (values.includes(username)) {
                code = key;
                break;
            }
        }

        if (code) {
            errorMessage.textContent = '';
            saveLoginState(username); // حفظ حالة تسجيل الدخول
            loadVideoContent(code, username);
            showMainContent();

            // Scroll to videos section
            document.getElementById('videos').scrollIntoView({ behavior: 'smooth' });
        } else {
            errorMessage.textContent = 'Invalid access code, please try again';
        }
    });

    // عند تحميل الصفحة، التحقق من حالة تسجيل الدخول
    checkLoginState();
});