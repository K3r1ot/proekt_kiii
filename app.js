var app = angular.module("SubjectsApp", []);

app.controller("SubjectsController", function ($scope, $http) {
    const API_URL = "http://localhost:5000/api/subjects";

    $scope.subjects = [];
    $scope.newSubject = {};
    $scope.editing = false;

    // Fetch all subjects
    $scope.loadSubjects = function () {
        $http.get(API_URL).then(
            function (response) {
                $scope.subjects = response.data;
            },
            function (error) {
                console.error("Error loading subjects", error);
            }
        );
    };

    // Add a new subject
    $scope.addSubject = function () {
        $http.post(API_URL, $scope.newSubject).then(
            function (response) {
                $scope.subjects.push(response.data);
                $scope.newSubject = {};
            },
            function (error) {
                console.error("Error adding subject", error);
            }
        );
    };

    // Delete a subject
    $scope.deleteSubject = function (id) {
        $http.delete(`${API_URL}/${id}`).then(
            function () {
                $scope.subjects = $scope.subjects.filter((s) => s.id !== id);
            },
            function (error) {
                console.error("Error deleting subject", error);
            }
        );
    };

    // Edit a subject
    $scope.editSubject = function (subject) {
        $scope.editing = true;
        $scope.editingSubject = angular.copy(subject);
    };

    // Update a subject
    $scope.updateSubject = function () {
        $http.put(`${API_URL}/${$scope.editingSubject.id}`, $scope.editingSubject).then(
            function () {
                $scope.loadSubjects();
                $scope.cancelEdit();
            },
            function (error) {
                console.error("Error updating subject", error);
            }
        );
    };

    // Cancel edit mode
    $scope.cancelEdit = function () {
        $scope.editing = false;
        $scope.editingSubject = null;
    };

    // Load subjects initially
    $scope.loadSubjects();
});
