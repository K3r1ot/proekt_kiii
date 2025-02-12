var app = angular.module("SubjectsApp", []);

app.controller("SubjectsController", function ($scope, $http) {
    const API_URL = "http://localhost:3000/api/subjects";

    $scope.subjects = []; // Ensure it's an empty array

    // Fetch all subjects
    $scope.loadSubjects = function () {
        $http.get(API_URL).then(
            function (response) {
                // Ensure response data is an array
                if (Array.isArray(response.data)) {
                    $scope.subjects = response.data;
                } else {
                    $scope.subjects = []; // Reset to an empty array if invalid data
                    console.error("Unexpected response data:", response.data);
                }
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
                if (response.data && typeof response.data === "object") {
                    $scope.subjects.push(response.data);
                    $scope.newSubject = {}; // Reset form
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
        // Copy the subject data into editingSubject
        $scope.editingSubject = angular.copy(subject);
    };

    // Update the subject
    $scope.updateSubject = function () {
        const updatedSubject = $scope.editingSubject;
        $http.put(`${API_URL}/${updatedSubject._id}`, updatedSubject).then(
            function (response) {
                // Find the index of the updated subject and replace it
                const index = $scope.subjects.findIndex((s) => s._id === updatedSubject._id);
                if (index !== -1) {
                    $scope.subjects[index] = response.data;
                }

                // Clear editingSubject
                $scope.editingSubject = null;
            },
            function (error) {
                console.error("Error updating subject", error);
            }
        );
    };

    // Cancel editing
    $scope.cancelEdit = function () {
        $scope.editingSubject = null; // Reset the editing form
    };

    // Delete a subject
    $scope.deleteSubject = function (id) {
        $http.delete(`${API_URL}/${id}`).then(
            function () {
                // Use _id here instead of id
                $scope.subjects = $scope.subjects.filter((s) => s._id !== id);
            },
            function (error) {
                console.error("Error deleting subject", error);
            }
        );
    };

    // Load subjects on page load
    $scope.loadSubjects();
});
