$(document).ready(function () {

    const baseURL = "http://api.login2explore.com:5577";
    const token = "90935945|-31948848614678320|90944754"
    const dbName = "Employee"
    const rel = "index"
    getAll();

    function request(req_type, req_data) {

        let data = {
            token, dbName, rel
        }

        data = Object.assign(data, req_data)
        return $.ajax({
            type: "POST",
            url: baseURL + "/api/" + req_type,
            data: JSON.stringify(data),
            dataType: "json"
        })
    }

    function getAll() {

        //Get all data  req_type, req_data
        let req = request('irl', { cmd: 'GET_ALL' });

        req.done((response) => {
            let data = JSON.parse(response.data)
            let records = data.json_records;
            let row = '';
            records.forEach(item => {
                if (item.record) {
                    row += `<tr>
                <td>${item.rec_no}</td>
                <td>${item.record.name}</td>
                <td>${item.record.email}</td>
                <td>${item.record.address}</td>
                <td>${item.record.phone}</td>
                <td>
                    <a href="#editEmployeeModal" data-id="${item.rec_no}" class="edit edit-record" data-toggle="modal"><i class="material-icons"
                            data-toggle="tooltip" title="Edit">&#xE254;</i></a>
                    <a href="#deleteEmployeeModal" data-id="${item.rec_no}" class="delete delete-record" data-toggle="modal"><i class="material-icons"
                            data-toggle="tooltip" title="Delete">&#xE872;</i></a>
                </td>
            </tr>`;
                }
            });
            $('#records').html(row);
        })
    }


    // insert
    $('#addEmployee').on('click', function () {
        $('#insertForm')[0].reset();
        $('#insert-msg').hide();
    });
    // insert function
    $('#insertForm').submit(function (e) {
        e.preventDefault();
        let formData = {
            "name": $('#name').val(),
            "email": $('#email').val(),
            "address": $('#address').val(),
            "phone": $('#phone').val()
        }
        let data = {
            "cmd": "PUT",
            "jsonStr": formData
        }
        //insert data
        let req = request('iml', data);

        req.done((response) => {
            if (response.status == 200) {
                $('#insert-msg').show();
                $('#insert-msg').html('Record Inserted Successfully!');
                getAll()
            }
        })
    });


    // edit data
    $('#records').on('click', '.edit-record', function () {
        let tr = $(this).parents('tr')
        $('#edit_id').val(tr.find(':nth-child(1)').html())
        $('#edit_name').val(tr.find(':nth-child(2)').html())
        $('#edit_email').val(tr.find(':nth-child(3)').html())
        $('#edit_address').val(tr.find(':nth-child(4)').html())
        $('#edit_phone').val(tr.find(':nth-child(5)').html());
        $('#edit-msg').hide();
    });
    // edit function
    $('#editForm').submit(function (e) {
        e.preventDefault();
        let rec_id = $('#edit_id').val();
        let formData = {};
        formData[rec_id] = {
            "name": $('#edit_name').val(),
            "email": $('#edit_email').val(),
            "address": $('#edit_address').val(),
            "phone": $('#edit_phone').val()
        }

        let data = {
            "cmd": "UPDATE",
            "jsonStr": formData
        }

        let req = request('iml', data);
        req.done((response) => {
            if (response.status == 200) {
                $('#edit-msg').show();
                $('#edit-msg').html('Record Updated Successfully!');
                getAll()
            }
        })
    });


    // remove data
    $('#records').on('click', '.delete-record', function () {
        $('#record_id').val($(this).data("id"));
    });
    // remove function
    $('#removeForm').submit(function (e) {
        e.preventDefault();
        let data = {
            "cmd": "REMOVE",
            "record": parseInt($('#record_id').val()),
        }
        let req = request('iml', data);

        req.done((response) => {
            if (response.status == 200) {
                $('#deleteEmployeeModal').modal('hide');
                getAll()
            }
        })
    });
});



