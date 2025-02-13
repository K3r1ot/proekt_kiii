var app = angular.module("SubjectsApp", []);

app.controller("SubjectsController", function ($scope, $http) {
    const API_URL = "http://localhost:3000/api/subjects";

    $scope.subjects = [];


    $scope.loadSubjects = function () {
        $http.get(API_URL).then(
            function (response) {

                if (Array.isArray(response.data)) {
                    $scope.subjects = response.data;
                } else {
                    $scope.subjects = [];
                    console.error("Unexpected response data:", response.data);
                }
            },
            function (error) {
                console.error("Error loading subjects", error);
            }
        );
    };


    $scope.addSubject = function () {
        $http.post(API_URL, $scope.newSubject).then(
            function (response) {
                if (response.data && typeof response.data === "object") {
                    $scope.subjects.push(response.data);
                    $scope.newSubject = {};
                } else {
                    console.error("Unexpected response:", response);
                }
            },
            function (error) {
                console.error("Error adding subject", error);
            }
        );
    };
    $scope.editSubject = function (subject) {

        $scope.editingSubject = angular.copy(subject);
    };


    $scope.updateSubject = function () {
        const updatedSubject = $scope.editingSubject;
        $http.put(`${API_URL}/${updatedSubject._id}`, updatedSubject).then(
            function (response) {

                const index = $scope.subjects.findIndex((s) => s._id === updatedSubject._id);
                if (index !== -1) {
                    $scope.subjects[index] = response.data;
                }


                $scope.editingSubject = null;
            },
            function (error) {
                console.error("Error updating subject", error);
            }
        );
    };


    $scope.cancelEdit = function () {
        $scope.editingSubject = null;
    };


    $scope.deleteSubject = function (id) {
        $http.delete(`${API_URL}/${id}`).then(
            function () {

                $scope.subjects = $scope.subjects.filter((s) => s._id !== id);
            },
            function (error) {
                console.error("Error deleting subject", error);
            }
        );
    };


    $scope.loadSubjects();
});
