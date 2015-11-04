/**
 * Created by Mirek on 2015-10-13.
 */

export default class Dialogs {
    static showError(title, msg) {
        swal(title, msg, "error");
    }

    static showInfo(title, msg) {
        swal(title, msg, "info");
    }

    static confirm(title, msg, callback) {
        swal({
            title: title,
            text: msg,
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: "#DD6B55",
            confirmButtonText: "Yes, do it!",
            closeOnConfirm: false
        }, function () {
            callback();
            swal("Success!", "Operation done.", "success");
        });
    }

    static input(title, msg, callback) {
        swal({
            title: title,
            text: msg,
            type: "input",
            inputPlaceholder: "gm/dokumenty:v4",
            showCancelButton: true,
            confirmButtonColor: "#DD6B55",
            confirmButtonText: "Yes, do it!",
            closeOnConfirm: false
        }, function (value) {
            if (value === false) return false;
            if (value === "") {
                swal.showInputError("You need to write something!");
                return false
            }
            callback(value);
            swal("Success!", "Operation done.", "success");
        });
    }
}
