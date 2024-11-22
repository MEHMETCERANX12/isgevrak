    var selectedRows = {};
    $(document).ready(function ()
    {
    var table = $('#tablo').DataTable({
        pageLength: 15,
        order: [[2, 'asc']],
        lengthMenu: [[10, 15, 50, 100, 500], [10, 15, 50, 100, 500]],
        language: {
            search: "Çalışan Ara:",
            lengthMenu: "Sayfa başına _MENU_ kayıt göster",
            zeroRecords: "Eşleşen kayıt bulunamadı",
            info: "_TOTAL_ kayıttan _START_ ile _END_ arası gösteriliyor",
            infoEmpty: "Kayıt yok",
            infoFiltered: "(toplam _MAX_ kayıttan filtrelendi)"
        },
        columnDefs: [
            { targets: 1, visible: false },
            { targets: 0, width: '8%' },
            { orderable: false, targets: 0 },
            { searchable: false, targets: 0 }
        ]
    });
    $('#tablo').on('change', '.row-checkbox', function () {
        var row = $(this).closest('tr');
        var rowData = table.row(row).data();
        var sanitizedRowData = rowData.slice(1);
        var rowKey = sanitizedRowData[2];

        if (this.checked) {
            selectedRows[rowKey] = sanitizedRowData;
        } else {
            delete selectedRows[rowKey];
        }

        updateLabel();
    });
    table.on('draw', function () {
        $('#tablo tbody input.row-checkbox').each(function () {
            var row = $(this).closest('tr');
            var rowData = table.row(row).data();
            var sanitizedRowData = rowData.slice(1);
            var rowKey = sanitizedRowData[2];

            $(this).prop('checked', !!selectedRows[rowKey]); // Seçiliyse işaretle
        });
    });
    $('.dt-search input').css({ "background-color": "white" }).attr("autocomplete", "off");
    $('.dt-length select').css({ "background-color": "white" });
});

    function selectAllRows()
    {
    const checkboxes = document.querySelectorAll('.row-checkbox');
    const table = $('#tablo').DataTable();

    checkboxes.forEach(checkbox => {
        const row = checkbox.closest('tr');
        const rowData = table.row(row).data();
        if (rowData) {
            const sanitizedRowData = rowData.slice(1);
            const rowKey = sanitizedRowData[2];
            selectedRows[rowKey] = sanitizedRowData;
        }
        checkbox.checked = true;
    });

    updateLabel();
    const totalSelected = Object.keys(selectedRows).length;
    alertify.error(`Toplam ${totalSelected} çalışan seçildi`);
}
    function deselectAllRows()
    {
    const checkboxes = document.querySelectorAll('.row-checkbox');
    const table = $('#tablo').DataTable();

    checkboxes.forEach(checkbox => {
        const row = checkbox.closest('tr');
        const rowData = table.row(row).data();
        if (rowData) {
            const sanitizedRowData = rowData.slice(1);
            const rowKey = sanitizedRowData[2];
            delete selectedRows[rowKey];
        }
        checkbox.checked = false; 
    });

        updateLabel();
}

function updateLabel() {
    const selectedFirmalar = Object.values(selectedRows).map(row => ({
        t: row[0],
        a: row[1],
        u: row[2]
    }));

    const jsonText = JSON.stringify(selectedFirmalar, null, 2);
    $.ajax({
        type: "POST",
        url: "datatable.aspx/SetSessionData",
        data: JSON.stringify({ data: jsonText }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response) {
            console.log("Veri başarıyla gönderildi:", response);
        },
        error: function (xhr, status, error) {
            console.error("Hata:", error);
        }
    });
}
