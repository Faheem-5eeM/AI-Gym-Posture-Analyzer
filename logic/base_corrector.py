# logic/base_corrector.py
from abc import ABC, abstractmethod

class BaseCorrector(ABC):
    def __init__(self):
        self.stage = "up"
        self.counter = 0
        self.landmarks = []
        self.column_names = []

    @abstractmethod
    def analyze_form(self, landmarks, model):
        pass