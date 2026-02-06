from rest_framework import viewsets
from rest_framework.response import Response
from ..models.technology import (
    PhysicalTechnologyCluster,
    DigitalTechnologyCluster,
    ProductRoadmap,
    TechnologyRoadmap,
    FoMType,
    TargetedProgramme,
    ACApplication
)


class PhysicalTechnologyClusterViewSet(viewsets.ReadOnlyModelViewSet):
    """
    ViewSet de solo lectura para PhysicalTechnologyCluster
    """
    queryset = PhysicalTechnologyCluster.objects.all().order_by('name')
    
    def list(self, request, *args, **kwargs):
        """
        Devuelve una lista simple de opciones: [{id, name}, ...]
        """
        clusters = self.get_queryset()
        data = [{'id': cluster.id, 'name': cluster.name} for cluster in clusters]
        return Response(data)


class DigitalTechnologyClusterViewSet(viewsets.ReadOnlyModelViewSet):
    """
    ViewSet de solo lectura para DigitalTechnologyCluster
    """
    queryset = DigitalTechnologyCluster.objects.all().order_by('name')
    
    def list(self, request, *args, **kwargs):
        """
        Devuelve una lista simple de opciones: [{id, name}, ...]
        """
        clusters = self.get_queryset()
        data = [{'id': cluster.id, 'name': cluster.name} for cluster in clusters]
        return Response(data)


class ProductRoadmapViewSet(viewsets.ReadOnlyModelViewSet):
    """
    ViewSet de solo lectura para ProductRoadmap
    """
    queryset = ProductRoadmap.objects.all().order_by('name')
    
    def list(self, request, *args, **kwargs):
        """
        Devuelve una lista simple de opciones: [{id, name}, ...]
        """
        roadmaps = self.get_queryset()
        data = [{'id': roadmap.id, 'name': roadmap.name} for roadmap in roadmaps]
        return Response(data)


class TechnologyRoadmapViewSet(viewsets.ReadOnlyModelViewSet):
    """
    ViewSet de solo lectura para TechnologyRoadmap
    """
    queryset = TechnologyRoadmap.objects.all().order_by('name')
    
    def list(self, request, *args, **kwargs):
        """
        Devuelve una lista simple de opciones: [{id, name}, ...]
        """
        roadmaps = self.get_queryset()
        data = [{'id': roadmap.id, 'name': roadmap.name} for roadmap in roadmaps]
        return Response(data)


class FoMTypeViewSet(viewsets.ReadOnlyModelViewSet):
    """
    ViewSet de solo lectura para FoMType
    """
    queryset = FoMType.objects.all().order_by('name')
    
    def list(self, request, *args, **kwargs):
        """
        Devuelve una lista simple de opciones: [{id, name}, ...]
        """
        fom_types = self.get_queryset()
        data = [{'id': fom_type.id, 'name': fom_type.name} for fom_type in fom_types]
        return Response(data)


class TargetedProgrammeViewSet(viewsets.ReadOnlyModelViewSet):
    """
    ViewSet de solo lectura para TargetedProgramme
    """
    queryset = TargetedProgramme.objects.all().order_by('name')
    
    def list(self, request, *args, **kwargs):
        """
        Devuelve una lista simple de opciones: [{id, name}, ...]
        """
        programmes = self.get_queryset()
        data = [{'id': programme.id, 'name': programme.name} for programme in programmes]
        return Response(data)


class ACApplicationViewSet(viewsets.ReadOnlyModelViewSet):
    """
    ViewSet de solo lectura para ACApplication
    """
    queryset = ACApplication.objects.all().order_by('name')
    
    def list(self, request, *args, **kwargs):
        """
        Devuelve una lista simple de opciones: [{id, name}, ...]
        """
        applications = self.get_queryset()
        data = [{'id': application.id, 'name': application.name} for application in applications]
        return Response(data)

