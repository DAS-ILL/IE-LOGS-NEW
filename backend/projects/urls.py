from django.urls import path
from .views import (
    MyProjectsListView,
    TeamProjectsListView,
    ProjectDetailView,
    ProjectCreateView,
    ProjectUpdateView,
    ProjectDeleteView,
    save_draft_view,
    submit_project_view,
    bulk_delete_view,
    lookup_data_view,
    filter_options_view,
    team_filter_options_view,
    export_excel_view,
    export_csv_view,
)

urlpatterns = [
    # Dashboard & Data
    path('get-logs/', MyProjectsListView.as_view(), name='my-projects'),
    path('get-team-projects/', TeamProjectsListView.as_view(), name='team-projects'),
    path('get-log/<int:pk>/', ProjectDetailView.as_view(), name='project-detail'),
    path('get-team-project-detail/<int:pk>/', ProjectDetailView.as_view(), name='team-project-detail'),
    
    # Project CRUD
    path('submit-log/', submit_project_view, name='submit-project'),
    path('save-log/', save_draft_view, name='save-draft'),
    path('update-log/<int:pk>/', ProjectUpdateView.as_view(), name='update-project'),
    path('delete-log/<int:pk>/', ProjectDeleteView.as_view(), name='delete-project'),
    path('bulk-delete/', bulk_delete_view, name='bulk-delete'),
    
    # Lookup & Filter Data
    path('lookup-data/', lookup_data_view, name='lookup-data'),
    path('filter-options/', filter_options_view, name='filter-options'),
    path('team-filter-options/', team_filter_options_view, name='team-filter-options'),
    
    # Export
    path('export-excel/', export_excel_view, name='export-excel'),
    path('export-csv/', export_csv_view, name='export-csv'),
]
